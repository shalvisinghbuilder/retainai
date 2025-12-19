import { SetMetadata } from '@nestjs/common';
import { Role } from '@retainai/db';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

