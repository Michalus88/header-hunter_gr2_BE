import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { HrRegisterDto } from '../hr/dto/hrRegister.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { MulterDiskUploadedFiles } from 'src/interfaces';
import { multerStorage, storageDir } from 'src/utils/storage';
import { ImportedStudentData } from 'types';

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

  // @Post('/student')
  // @UseInterceptors(
  //   FileFieldsInterceptor(
  //     [
  //       {
  //         name: 'studentsList',
  //         maxCount: 1,
  //       },
  //     ],
  //     { storage: multerStorage(path.join(storageDir(), 'students-list')) },
  //   ),
  // )
  // studentRegister(
  //   @UploadedFiles() files: MulterDiskUploadedFiles,
  // ): Promise<ImportedStudentData[]> {
  //   return this.userService.studentRegister(files);
  // }
}
