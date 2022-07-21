import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { multerStorage, storageDir } from 'src/utils/storage';
import { MulterDiskUploadedFiles } from 'types/files/files';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
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
  )
  addCSV(@UploadedFiles() files: MulterDiskUploadedFiles): string {
    return this.userService.addCSV(files);
  }
}
