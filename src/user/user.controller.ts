import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { HrRegisterDto } from '../hr/dto/hrRegister.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { multerStorage, storageDir } from 'src/utils/storage';
import { PasswordRecovery, StudentRegisterResponse } from 'types';
import { ImportCsvAndValidateData } from 'src/interceptors/import-csv-and-validate-data.interceptor';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsAdmin } from '../guards/is-admin';
import { PasswordChangeDto } from './dto/password-change.dto';
import { UserObj } from '../decorators/user-object.decorator';
import { User } from './user.entity';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/student/activate/:userId/:registerToken')
  accountActivation(
    @Param('userId') userId: string,
    @Param('registerToken') registerToken: string,
  ) {
    return this.userService.accountActivation(userId, registerToken);
  }

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

  @Patch('/password')
  @UseGuards(JwtAuthGuard)
  passwordChange(
    @Body() passwordChangedDto: PasswordChangeDto,
    @UserObj() user: User,
  ) {
    return this.userService.passwordChange(passwordChangedDto, user);
  }

  @Patch('/password-recovery')
  passwordRecovery(
    @Body() passwordRecovery: PasswordRecovery,
    @Res() res: Response,
  ) {
    return this.userService.passwordRecovery(passwordRecovery, res);
  }
}
