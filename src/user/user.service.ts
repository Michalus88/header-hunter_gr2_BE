import { BadRequestException, Injectable } from '@nestjs/common';
import { uuid } from 'uuidv4';
import * as path from 'path';
import * as fs from 'fs';
import { User } from './user.entity';
import { hashPwd } from '../utils/hash-pwd';
import { Role, UserRes, ImportedStudentData } from 'types';
import { HrRegisterDto } from '../hr/dto/hrRegister.dto';
import { HrProfile } from '../hr/hr-profile.entity';

import {
  papaparseToArrOfObj,
  validateImportedStudentDatas,
} from 'src/utils/csvParse';
import { storageDir } from 'src/utils/storage';
import { MulterDiskUploadedFiles } from 'src/interfaces';

@Injectable()
export class UserService {
  async getByEmail(email: string): Promise<User | null> {
    return await User.findOne({
      where: {
        email,
      },
    });
  }

  async hrRegister(hrRegisterDto: HrRegisterDto) {
    const { email, firstName, lastName, company, maxReservedStudents } =
      hrRegisterDto;
    await this.checkingEmailAvailability(email);

    const user = new User();
    const salt = uuid();
    const password = uuid();
    user.email = email;
    user.password = user.password = hashPwd(password, salt);
    user.role = Role.HR;
    user.salt = salt;
    user.registerToken = uuid();

    const profile = new HrProfile();
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.email = email;
    profile.company = company;
    profile.maxReservedStudents = maxReservedStudents;

    await user.save();
    await profile.save();
    return { user, password };
    // return sanitizeUser(user);
  }

  async studentRegister(
    files: MulterDiskUploadedFiles,
  ): Promise<ImportedStudentData[]> {
    const csvFile = files?.studentsList?.[0] ?? null;
    let csvText = '';
    try {
      if (csvFile) {
        csvText = String(
          fs.readFileSync(
            path.join(storageDir(), 'students-list', csvFile.filename),
          ),
        );
      }
    } catch (e2) {
      throw e2;
    }

    const validateImportedStudentList = validateImportedStudentDatas(
      papaparseToArrOfObj(csvText),
    );

    return validateImportedStudentList;
    
    // async studentRegister(): Promise<UserRes> {
    //   //TUTAJ MUSISZ ZROBIĆ VALIDACJĘ POD KONTEM @ W EMAILU

    //   // await this.checkingEmailAvailability(email) // walidacja czy już istnieje w bazie

    //   const user = new User();
    //   const salt = uuid();
    //   const password = uuid();
    //   const registerToken = uuid();
    //   // user.email = email; //dodasz jak wyciągniesz emaila z pliku
    //   user.password = user.password = hashPwd(password, salt);
    //   //POLE fullName będzie dodane przy aktywacji studenta
    //   user.role = Role.STUDENT;
    //   user.salt = salt;
    //   user.registerToken = registerToken;

    //   await user.save();
    //   return user;
    //   // return sanitizeUser(user);
  }

  async checkingEmailAvailability(email) {
    if (await this.getByEmail(email)) {
      throw new BadRequestException(
        'The user with the given email already exists.',
      );
    }
  }
}
