import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { MulterDiskUploadedFiles } from 'types/files/files';
import { AppService } from './app.service';
import { multerStorage, storageDir } from './utils/storage';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    return this.appService.addCSV(files);
  }
}
