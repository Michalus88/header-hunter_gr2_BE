import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from '../mail/mail.module';
import { StudentModule } from '../student/student.module';
import { AuthModule } from '../auth/auth.module';
import { HrModule } from '../hr/hr.module';

@Module({
  imports: [
    forwardRef(() => MailModule),
    forwardRef(() => StudentModule),
    forwardRef(() => AuthModule),
    forwardRef(() => HrModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
