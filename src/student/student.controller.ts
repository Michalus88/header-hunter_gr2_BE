import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentProfileActivationDto } from './dto/profile-register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FilteringOptions } from '../../types';
import { IsHr } from '../guards/is-hr';
import { StudentProfileUpdateDto } from './dto/profile-update.dto';
import { GithubUserValidate } from 'src/interceptors/gihub-user-validate.interceptor';
import { EmailExistInDBValidate } from 'src/interceptors/email-exist-in-DB-validate.interceptor';
import { UserObj } from '../decorators/user-object.decorator';
import { User } from '../user/user.entity';
import { IsStudent } from '../guards/is-student';

@Controller('api/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Put('/:studentId')
  @UseGuards(JwtAuthGuard, IsStudent)
  @UseInterceptors(GithubUserValidate, EmailExistInDBValidate)
  studentProfileUpdate(
    @UserObj() user: User,
    @Body() studentProfileUpdateDto,
    @Param('userId') studentId: string,
  ) {
    return this.studentService.studentProfileUpdate(
      user,
      studentProfileUpdateDto,
      studentId,
    );
  }

  @Get('/available')
  @UseGuards(JwtAuthGuard, IsHr)
  getAllAvailable() {
    return this.studentService.getAllAvailable();
  }

  @UseGuards(JwtAuthGuard, IsHr)
  @Get('/filtered')
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
}
