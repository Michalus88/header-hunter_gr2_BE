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

    const { userId } = req.params;
    const { email } = req.body;

    const userEmail = await User.createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.email = :email AND NOT user.id = :userId', {
        email,
        userId,
      })
      .getOne();
    // console.log(userEmail);

    if (userEmail) throw new BadRequestException('Email exist.');
    return next.handle();
  }
}
