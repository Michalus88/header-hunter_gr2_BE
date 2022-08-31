import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'types';

@Injectable()
export class IsHr implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const { role } = context.switchToHttp().getRequest().user;
    console.log(role);
    return role === Role.HR;
  }
}
