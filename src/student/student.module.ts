import { forwardRef, Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => MailModule),
    forwardRef(() => ReservationModule),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
