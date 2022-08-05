import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentProfileActivationDto } from './dto/profile-register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FilteringOptions } from '../../types';
import { IsHr } from '../guards/is-hr';

@Controller('api/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

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
