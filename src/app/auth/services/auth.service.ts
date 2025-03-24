import * as bcrypt from 'bcryptjs';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthPayloadDTO } from '../dtos/auth-payload.dto';
import { UserService } from 'src/app/users/services/user.service';
import { User } from 'src/app/users/entities/user.entity';
import { JwtPayload } from '../interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthConstants } from '../constants/auth.constants';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser({
    email,
    password,
  }: AuthPayloadDTO): Promise<Omit<User, 'password'>> {
    const foundUser: User = await this.userService.getByEmail(email);
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...safeUser } = foundUser;

    return safeUser;
  }

  async register(
    data: Omit<User, 'id'>,
    response: Response,
    deviceId?: string,
  ): Promise<Omit<User, 'password'>> {
    const newUser: User = await this.userService.create(data, deviceId);

    const { password: _, ...userWithoutPassword } = newUser;

    await this.login(userWithoutPassword, response);

    return userWithoutPassword;
  }

  async login(user: Omit<User, 'password'>, response: Response): Promise<void> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = await this.getTokens(payload);

    const { expiresAccessToken, expiresRefreshToken } =
      this.setExpirationTimes();

    await this.updateHashedRefreshToken(user.id, refreshToken);

    const isProduction = this.configService.get('NODE_ENV') === 'production';

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: expiresAccessToken,
    });
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: expiresRefreshToken,
    });
  }

  async logout(userId: string, response: Response): Promise<void> {
    response.clearCookie('Authentication');
    response.clearCookie('Refresh');
    await this.userService.updateRefreshToken(userId, null);
  }

  async getTokens(
    payload: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          AuthConstants.JWT_ACCESS_TOKEN_SECRET,
        ),
        expiresIn: `${this.configService.getOrThrow<string>(
          AuthConstants.JWT_ACCESS_TOKEN_EXPIRATION_MS,
        )}ms`,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          AuthConstants.JWT_REFRESH_TOKEN_SECRET,
        ),
        expiresIn: `${this.configService.getOrThrow<string>(
          AuthConstants.JWT_REFRESH_TOKEN_EXPIRATION_MS,
        )}ms`,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  setExpirationTimes(): {
    expiresAccessToken: Date;
    expiresRefreshToken: Date;
  } {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getMilliseconds() +
        parseInt(
          this.configService.getOrThrow<string>(
            AuthConstants.JWT_ACCESS_TOKEN_EXPIRATION_MS,
          ),
        ),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setMilliseconds(
      expiresRefreshToken.getMilliseconds() +
        parseInt(
          this.configService.getOrThrow<string>(
            AuthConstants.JWT_REFRESH_TOKEN_EXPIRATION_MS,
          ),
        ),
    );

    return { expiresAccessToken, expiresRefreshToken };
  }

  async updateHashedRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
  }

  async verifyUserRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.getById(userId);

    if (!user || !user.refreshToken) {
      throw new NotFoundException('Invalid refresh token');
    }

    const isAuthenticated = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isAuthenticated) {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    const { password: _, ...safeUser } = user;

    return safeUser;
  }
}
