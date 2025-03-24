import { Reflector } from '@nestjs/core';
import { Role } from 'src/app/users/enums/role.enum';

export const Roles = Reflector.createDecorator<Role[]>();
