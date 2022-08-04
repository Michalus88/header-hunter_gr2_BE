import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { HrRegisterDto } from '../hr/dto/hrRegister.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { multerStorage, storageDir } from 'src/utils/storage';
import { StudentRegisterResponse } from 'types';
import { ImportCsvAndValidateData } from 'src/interceptors/import-csv-and-validate-data.interceptor';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsAdmin } from '../guards/is-admin';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/hr')
  @UseGuards(JwtAuthGuard, IsAdmin)
  hrRegister(@Body() hrRegisterDto: HrRegisterDto) {
    return this.userService.hrRegister(hrRegisterDto);
  }

  @Post('/student')
  @UseGuards(JwtAuthGuard, IsAdmin)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'studentsList',
          maxCount: 1,
        },
      ],
      { storage: multerStorage(path.join(storageDir(), 'students-list')) },
    ),
    ImportCsvAndValidateData,
  )
  studentRegister(@Req() req): Promise<StudentRegisterResponse> {
    return this.userService.studentRegister(
      req.importStudents,
      req.incorrectData,
    );
  }

  @Get('/student/activate/:userId/:registerToken')
  accountActivation(
    @Param('userId') userId: string,
    @Param('registerToken') registerToken: string,
  ) {
    return this.userService.accountActivation(userId, registerToken);
  }
  @Get('/isCorrectGitHubStudentAccount/:gitHubUser')
  isCorrectGitHubStudentAccount(@Param('gitHubUser') gitHubUser: string) {
    return this.userService.isCorrectGitHubStudentAccount(gitHubUser);
  }
}
