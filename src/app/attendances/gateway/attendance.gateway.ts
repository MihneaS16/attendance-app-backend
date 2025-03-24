import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import { randomBytes } from 'crypto';
import { User } from 'src/app/users/entities/user.entity';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserService } from 'src/app/users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthConstants } from 'src/app/auth/constants/auth.constants';
import { AttendanceSocketEvent } from '../enums/attendance-socket-event.enum';
import { JwtPayload } from 'src/app/auth/interfaces/token-payload.interface';
import { Role } from 'src/app/users/enums/role.enum';

declare module 'socket.io' {
  interface Socket {
    user?: Omit<User, 'password'>;
  }
}

@WebSocketGateway()
export class AttendanceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AttendanceGateway');
  private sessionTokens: Record<string, string> = {};
  private sessionIntervals: Record<string, NodeJS.Timeout> = {};

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(): void {
    this.logger.log('AttendanceGateway initialized');
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const parsedCookies = cookie.parse(client.handshake.headers.cookie ?? '');
      const token = parsedCookies['Authentication'];

      if (!token) {
        this.logger.error('No auth cookie found');
        client.emit(
          AttendanceSocketEvent.CONNECTION_ERROR,
          'No authentication cookie',
        );
        client.disconnect();
        return;
      }

      const secret = this.configService.getOrThrow<string>(
        AuthConstants.JWT_ACCESS_TOKEN_SECRET,
      );

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      const user: User = await this.userService.getById(payload.sub);
      const { password: _, ...safeUser } = user;

      client.user = safeUser;

      this.logger.log(`Client connected: ${client.id} (User ID: ${user.id})`);
    } catch (error) {
      this.logger.error('WebSocket connection error', error);
      client.emit(
        AttendanceSocketEvent.CONNECTION_ERROR,
        'Invalid or expired authentication cookie',
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(
      `Client disconnected: ${client.id} (User ID: ${client.user?.id ?? '?'})`,
    );

    const socketData = client.data as { activeSessionId?: string };

    if (client.user?.role === Role.PROFESSOR && socketData.activeSessionId) {
      const sessionId = socketData.activeSessionId;
      this.stopAttendance(sessionId);
      this.logger.log(
        `Stopped generating codes for session=${sessionId} because professor disconnected.`,
      );
    }
  }

  @SubscribeMessage(AttendanceSocketEvent.START_ATTENDANCE)
  handleStartAttendance(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    if (client.user?.role !== Role.PROFESSOR) {
      client.emit(
        AttendanceSocketEvent.CONNECTION_ERROR,
        'Not authorized to start attendance',
      );
      client.disconnect();
      return;
    }

    const socketData = client.data as { activeSessionId?: string };
    socketData.activeSessionId = data.sessionId;

    if (this.sessionIntervals[data.sessionId]) {
      clearInterval(this.sessionIntervals[data.sessionId]);
    }

    this.generateAndSendToken(client, data.sessionId);

    this.sessionIntervals[data.sessionId] = setInterval(() => {
      this.generateAndSendToken(client, data.sessionId);
    }, 5000);

    this.logger.log(
      `START_ATTENDANCE for session=${data.sessionId} (professorId=${client.user?.id})`,
    );
  }

  @SubscribeMessage(AttendanceSocketEvent.STOP_ATTENDANCE)
  handleStopAttendance(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    if (client.user?.role !== Role.PROFESSOR) {
      client.emit(
        AttendanceSocketEvent.CONNECTION_ERROR,
        'Not authorized to stop attendance',
      );
      client.disconnect();
      return;
    }
    this.stopAttendance(data.sessionId);
    this.logger.log(
      `STOP_ATTENDANCE for session=${data.sessionId} (professorId=${client.user?.id})`,
    );
  }

  getCurrentCodeForSession(sessionId: string): string | undefined {
    return this.sessionTokens[sessionId];
  }

  private stopAttendance(sessionId: string) {
    if (this.sessionIntervals[sessionId]) {
      clearInterval(this.sessionIntervals[sessionId]);
      delete this.sessionIntervals[sessionId];
    }
    delete this.sessionTokens[sessionId];
  }

  private generateAndSendToken(client: Socket, sessionId: string): void {
    const newToken = randomBytes(4).toString('hex');
    this.sessionTokens[sessionId] = newToken;
    client.emit(AttendanceSocketEvent.QR_UPDATE, {
      code: newToken,
      sessionId,
    });
  }
}
