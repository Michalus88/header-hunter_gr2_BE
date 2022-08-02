import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { HrRegisterDto } from '../hr/dto/hrRegister.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { multerStorage, storageDir } from 'src/utils/storage';
import { ImportedStudentData, StudentRegisterResponse } from 'types';
import { ImportCsvAndValidateData } from 'src/interceptors/import-csv-and-validate-data.interceptor';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/hr')
  hrRegister(@Body() hrRegisterDto: HrRegisterDto) {
    return this.userService.hrRegister(hrRegisterDto);
  }

  @Post('/student')
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
    return this.userService.studentRegister(req.importStudents);
  }

  @Get('/student/activate/:userId/:registerToken')
  accountActivation(
    @Param('userId') userId: string,
    @Param('registerToken') registerToken: string,
  ) {
    return this.userService.accountActivation(userId, registerToken);
  }
}
