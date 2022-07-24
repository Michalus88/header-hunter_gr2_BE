import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { HrRegisterDto } from '../hr/dto/hrRegister.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/hr')
  hrRegister(@Body() hrRegisterDto: HrRegisterDto) {
    return this.userService.hrRegister(hrRegisterDto);
  }

  @Post('/student')
  studentRegister() {
    return this.userService.studentRegister();
  }
}
