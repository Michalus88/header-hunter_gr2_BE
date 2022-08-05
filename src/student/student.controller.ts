import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentProfileActivationDto } from './dto/profile-register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsHr } from '../guards/is-hr';
import { StudentProfileUpdateDto } from './dto/profile-update.dto';
import { GithubUserValidate } from 'src/interceptors/gihub-user-validate.interceptor';
import { EmailExistInDBValidate } from 'src/interceptors/email-exist-in-DB-validate.interceptor';

@Controller('api/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Patch('/:userId')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(EmailExistInDBValidate, GithubUserValidate)
  studentProfileUpdate(
    @Body() studentProfile: StudentProfileUpdateDto,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.studentService.studentProfileUpdate(studentProfile, userId);
  }

  @Get('/available')
  @UseGuards(JwtAuthGuard, IsHr)
  getAllAvailable() {
    return this.studentService.getAllAvailable();
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
