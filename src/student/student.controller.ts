import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentProfileActivationDto } from './dto/profile-register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FilteringOptions } from '../../types';
import { IsHr } from '../guards/is-hr';
import { GithubUserValidate } from 'src/interceptors/gihub-user-validate.interceptor';
import { EmailExistInDBValidate } from 'src/interceptors/email-exist-in-DB-validate.interceptor';
import { UserObj } from '../decorators/user-object.decorator';
import { User } from '../user/user.entity';
import { IsStudent } from '../guards/is-student';
import { Response } from 'express';

@Controller('api/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('/available/:maxPerPage?/:currentPage?')
  @UseGuards(JwtAuthGuard, IsHr)
  getAllAvailableWhitPagination(
    @Param('maxPerPage') maxPerPage: number,
    @Param('currentPage') currentPage: number,
  ) {
    return this.studentService.getAllAvailableWhitPagination(
      maxPerPage,
      currentPage,
    );
  }

  @Get('/detailed')
  @UseGuards(JwtAuthGuard, IsStudent)
  getDetailedStudent(@UserObj() user: User) {
    return this.studentService.getDetailedStudent(user);
  }

  @Post('/filtered')
  @UseGuards(JwtAuthGuard, IsHr)
  getFilteredStudent(@Body() filteringOptions: FilteringOptions) {
    return this.studentService.getFilteredStudents(filteringOptions);
  }

  @Post('/activate/:userId/:registerToken')
  activateProfile(
    @Body() studentProfileActivation: StudentProfileActivationDto,
    @Param('userId') userId: string,
    @Param('registerToken') registerToken: string,
  ) {
    return this.studentService.activateProfile(
      studentProfileActivation,
      userId,
      registerToken,
    );
  }

  @Put('/')
  @UseGuards(JwtAuthGuard, IsStudent)
  @UseInterceptors(GithubUserValidate, EmailExistInDBValidate)
  studentProfileUpdate(@UserObj() user: User, @Body() studentProfileUpdateDto) {
    return this.studentService.studentProfileUpdate(
      user,
      studentProfileUpdateDto,
    );
  }

  @Patch('/hired')
  @UseGuards(JwtAuthGuard, IsStudent)
  markAsHired(@UserObj() user: User, @Res() res: Response) {
    return this.studentService.markAsHired(user, res);
  }
}
