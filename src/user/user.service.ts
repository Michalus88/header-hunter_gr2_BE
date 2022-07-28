import { BadRequestException, Injectable } from '@nestjs/common';
import { uuid } from 'uuidv4';
import { User } from './user.entity';
import { hashPwd } from '../utils/hash-pwd';
import { ImportedStudentData, Role } from 'types';
import { HrRegisterDto } from '../hr/dto/hrRegister.dto';
import { HrProfile } from '../hr/hr-profile.entity';
import { MailService } from '../mail/mail.service';
import { sanitizeUser } from '../utils/sanitize-user';

@Injectable()
export class UserService {
  constructor(private mailService: MailService) {}

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

    const { userId, password, registerToken } = await this.saveToUserEntity(
      email,
      Role.HR,
    );

    const profile = new HrProfile();
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.email = email;
    profile.company = company;
    profile.maxReservedStudents = maxReservedStudents;
    profile.userId = userId;

    await profile.save();

    await this.mailService.sendActivateLink(
      email,
      userId,
      registerToken,
      password,
    );

    return sanitizeUser(user);
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
    }

    return {
      numberOfStudentsToRegister,
      numberOfSuccessfullyRegistered,
      numberOfEmailsAlreadyRegistered,
    };

    //   files: MulterDiskUploadedFiles,
    // ): Promise<ImportedStudentData[]> {
    //   const csvFile = files?.studentsList?.[0] ?? null;
    //   let csvText = '';
    //   try {
    //     if (csvFile) {
    //       csvText = String(
    //         fs.readFileSync(
    //           path.join(storageDir(), 'students-list', csvFile.filename),
    //         ),
    //       );
    //     }
    //   } catch (e2) {
    //     throw e2;
    //   }
    //
    //   const validateImportedStudentList = validateImportedStudentData(
    //     papaparseToArrOfObj(csvText),
    //   );
    //
    //   return validateImportedStudentList;
  }

  async checkingEmailAvailability(email) {
    if (await this.getByEmail(email)) {
      throw new BadRequestException(
        'The user with the given email already exists.',
      );
    }
  }
  async saveToUserEntity(email: string, role: Role) {
    const user = new User();
    const salt = uuid();
    const password = uuid();
    const userId = uuid();
    const registerToken = uuid();

    user.id = userId;
    user.email = email;
    user.password = user.password = hashPwd(password, salt);
    user.role = role;
    user.salt = salt;
    user.registerToken = registerToken;
    await user.save();
    return { password, userId, registerToken };
  }
}
