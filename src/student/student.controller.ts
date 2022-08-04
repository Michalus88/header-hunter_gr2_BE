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
import { StudentProfileUpdate } from 'types';
import { StudentDetailDataValidate } from 'src/interceptors/student-detail-data-validate.interceptor';
import { StudentProfile } from './student-profile.entity';

@Controller('api/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Patch('/:userId')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(StudentDetailDataValidate)
  studentProfileUpdate(
    @Body() studentProfile: StudentProfile,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.studentService.studentProfileUpdate(
      studentProfile,
      userId,
      req.errors,
    );
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
