import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserObj } from '../decorators/user-object.decorator';
import { User } from '../user/user.entity';
import { StudentService } from '../student/student.service';
import { IsHr } from '../guards/is-hr';

@Controller('api/hr')
export class HrController {
  constructor(
    private readonly hrService: HrService,
    private readonly studentService: StudentService,
  ) {}

  @Get('/reserved-students')
  @UseGuards(JwtAuthGuard, IsHr)
  getReservedStudents(@UserObj() user: User) {
    return this.studentService.getReservedStudents(user);
  }

  @Get('/reserved-students/:studentId')
  @UseGuards(JwtAuthGuard, IsHr)
  getDetailedStudents(
    @UserObj() user: User,
    @Param('studentId') studentId: string,
  ) {
    return this.studentService.getDetailedStudent(user, studentId);
  }

  @Patch('/booking-student/:studentId')
  @UseGuards(JwtAuthGuard, IsHr)
  getAvailable(@UserObj() user: User, @Param('studentId') studentId: string) {
    return this.hrService.bookingStudent(user, studentId);
  }
}
