import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from '../mail/mail.module';
import { StudentModule } from '../student/student.module';

@Module({
  providers: [UserService],
  imports: [forwardRef(() => MailModule), forwardRef(() => StudentModule)],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
