import { Role } from 'src/app/users/enums/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
