import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";

import { Role } from "../enums/role.enum";
import { FirstLoginGuard } from "../guards/first-login.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(JwtAuthGuard, RolesGuard, FirstLoginGuard),
  );
}
