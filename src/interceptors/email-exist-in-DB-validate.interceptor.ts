import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class EmailExistInDBValidate implements NestInterceptor {
  constructor(@InjectDataSource() private reflector: Reflector) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const [req] = context.getArgs();

    const userId = context.switchToHttp().getRequest().user.id;
    const { email } = req.body;
    const userEmail = await User.createQueryBuilder()
      .select('u.email')
      .from(User, 'u')
      .where('u.email = :email AND NOT u.id = :userId', {
        email,
        userId,
      })
      .getOne();
    if (userEmail) throw new BadRequestException('Email exist.');
    return next.handle();
  }
}
