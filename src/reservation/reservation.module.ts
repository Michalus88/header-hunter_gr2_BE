import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';

@Module({
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
