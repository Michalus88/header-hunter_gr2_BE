import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentProfileActivationDto } from './dto/profile-register.dto';

@Controller('api/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('/available')
  getAvailable() {
    return this.studentService.getAvailable();
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
