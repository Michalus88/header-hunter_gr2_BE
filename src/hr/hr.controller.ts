import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserObj } from '../decorators/user-object.decorator';
import { User } from '../user/user.entity';
import { StudentService } from '../student/student.service';

@Controller('api/hr')
export class HrController {
  constructor(
    private readonly hrService: HrService,
    private readonly studentService: StudentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/reserved-students')
  getReservedStudents(@UserObj() user: User) {
    return this.studentService.getReservedStudents(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/booking-student/:studentId')
  getAvailable(@UserObj() user: User, @Param('studentId') studentId: string) {
    return this.hrService.bookingStudent(user, studentId);
  }
}
