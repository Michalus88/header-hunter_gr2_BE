import { forwardRef, Module } from '@nestjs/common';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [forwardRef(() => StudentModule)],
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}
