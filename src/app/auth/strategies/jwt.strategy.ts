import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthConstants } from '../constants/auth.constants';
import { JwtPayload } from '../interfaces/token-payload.interface';
import { UserService } from 'src/app/users/services/user.service';
import { User } from 'src/app/users/entities/user.entity';
import { AuthCookieRequest } from '../interfaces/auth-cookie-req.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: AuthCookieRequest): string | null => {
          return request.cookies.Authentication || null;
        },
      ]),
      secretOrKey: configService.getOrThrow<string>(
        AuthConstants.JWT_ACCESS_TOKEN_SECRET,
      ),
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<User, 'password'>> {
    if (!payload) {
      throw new UnauthorizedException();
    }
    const foundUser = await this.userService.getById(payload.sub);
    const { password: _, ...safeUser } = foundUser;

    return safeUser;
  }
}
