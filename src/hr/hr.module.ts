import { forwardRef, Module } from '@nestjs/common';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { StudentModule } from '../student/student.module';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [
    forwardRef(() => StudentModule),
    forwardRef(() => ReservationModule),
  ],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}
