import { JwtPayload } from './token-payload.interface';

export interface ExtendedJwtPayload extends JwtPayload {
  iat: number;
  exp: number;
  iss: string;
}
