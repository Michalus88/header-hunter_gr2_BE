import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserObj } from '../decorators/user-object.decorator';
import { User } from '../user/user.entity';
import { StudentService } from '../student/student.service';
import { FilteringOptions } from '../../types';
import { IsHr } from '../guards/is-hr';
import { Response } from 'express';

@Controller('api/hr')
export class HrController {
  constructor(
    private readonly hrService: HrService,
    private readonly studentService: StudentService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard, IsHr)
  getMe(@UserObj() user: User) {
    return this.hrService.getMe(user);
  }

  @Get('/booked-students')
  @UseGuards(JwtAuthGuard, IsHr)
  getBookedStudents(@UserObj() user: User) {
    return this.hrService.getBookedStudents(user);
  }

  @Get('/booked-students/:studentId')
  @UseGuards(JwtAuthGuard, IsHr)
  getDetailedStudent(
    @UserObj() user: User,
    @Param('studentId') studentId: string,
  ) {
    return this.studentService.getDetailedStudent(user, studentId);
  }

  @Post('/booked-students/filtered')
  @UseGuards(JwtAuthGuard, IsHr)
  getBookedFilteredStudent(
    @UserObj() user: User,
    @Body() filteringOptions: FilteringOptions,
  ) {
    return this.hrService.getFilteredBookingStudents(user, filteringOptions);
  }

  @Patch('/booking-student/:studentId')
  @UseGuards(JwtAuthGuard, IsHr)
  bookingStudent(@UserObj() user: User, @Param('studentId') studentId: string) {
    return this.hrService.bookingStudent(user, studentId);
  }

  @Patch('/hired/:studentId')
  @UseGuards(JwtAuthGuard, IsHr)
  markAsHired(
    @UserObj() user: User,
    @Res() res: Response,
    @Param('studentId') studentId: string,
  ) {
    return this.studentService.markAsHired(user, res, studentId);
  }
}
