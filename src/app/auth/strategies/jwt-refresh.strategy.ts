import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthConstants } from '../constants/auth.constants';
import { JwtPayload } from '../interfaces/token-payload.interface';
import { AuthCookieRequest } from '../interfaces/auth-cookie-req.interface';
import { AuthService } from '../services/auth.service';
import { User } from 'src/app/users/entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: AuthCookieRequest): string | null => {
          return request.cookies.Refresh || null;
        },
      ]),
      secretOrKey: configService.getOrThrow<string>(
        AuthConstants.JWT_REFRESH_TOKEN_SECRET,
      ),
      passReqToCallback: true,
    });
  }

  async validate(
    req: AuthCookieRequest,
    payload: JwtPayload,
  ): Promise<Omit<User, 'password'>> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (!req.cookies.Refresh) {
      throw new UnauthorizedException();
    }

    return this.authService.verifyUserRefreshToken(
      payload.sub,
      req.cookies.Refresh,
    );
  }
}
