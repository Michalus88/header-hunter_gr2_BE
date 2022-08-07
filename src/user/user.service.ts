import { BadRequestException, Injectable } from '@nestjs/common';
import { hashPwd } from '../utils/hash-pwd';
import { uuid } from 'uuidv4';
import { sanitizeUser } from '../utils/sanitize-user';
import { validateActivationCredentials } from '../utils/validate-activation-credentials';
import { User } from './user.entity';
import { HrProfile } from '../hr/hr-profile.entity';
import { MailService } from '../mail/mail.service';
import { StudentService } from '../student/student.service';
import { ImportedStudentData, StudentRegisterResponse, Role } from 'types';
import { HrRegisterDto } from '../hr/dto/hrRegister.dto';
import { PasswordChangeDto } from './dto/password-change.dto';

@Injectable()
export class UserService {
  constructor(
    private mailService: MailService,
    private studentService: StudentService,
  ) {}

  async getByEmail(email: string): Promise<User | null> {
    return await User.findOneBy({ email });
  }

  async hrRegister(hrRegisterDto: HrRegisterDto) {
    const { email, firstName, lastName, company, maxReservedStudents } =
      hrRegisterDto;
    await this.checkingEmailAvailability(email);
    const { user, password, registerToken } = await this.saveToUserEntity(
      email,
      Role.HR,
    );
    const profile = new HrProfile();
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.email = email;
    profile.company = company;
    profile.maxReservedStudents = maxReservedStudents;
    profile.user = user;
    await profile.save();

    await this.mailService.sendActivateLink(
      email,
      user.id,
      registerToken,
      password,
    );

    return {
      statusCode: 201,
      message: 'Success.',
      userId: user.id,
    };
  }

  async studentRegister(
    students: ImportedStudentData[],
    incorrectStudentData: {
      number: 0;
      emails: [];
    },
  ): Promise<StudentRegisterResponse> {
    const response = {
      numberOfStudentsToRegister: incorrectStudentData.number,
      numberOfSuccessfullyRegistered: 0,
      emailsAlreadyRegistered: {
        number: 0,
        emails: [],
      },
      incorrectStudentData: {
        number: 0,
        emails: [],
      },
    };

    for (const student of students) {
      response.numberOfStudentsToRegister++;
      const user = await this.getByEmail(student.email);

      if (user) {
        response.emailsAlreadyRegistered.number++;
        response.emailsAlreadyRegistered.emails.push(user.email);
      } else {
        response.numberOfSuccessfullyRegistered++;
        const { user, password, registerToken } = await this.saveToUserEntity(
          student.email,
          Role.STUDENT,
        );
        await this.studentService.saveDataFromCsvToDb(student, user);

        // Wyłączone wysyłanie emaili przy developmencie
        // await this.mailService.sendActivateLink(
        //   student.email,
        //   userId,
        //   registerToken,
        //   password,
        // );
      }
    }

    response.incorrectStudentData = incorrectStudentData;

    return response;
  }

  async accountActivation(userId: string, registerToken: string) {
    const user = await User.findOneBy({ id: userId });

    validateActivationCredentials(user, registerToken);
    if (user.role === Role.HR) {
      user.isActive = true;
      user.registerToken = null;
      await user.save();
    }

    return sanitizeUser(user);
  }

  async passwordChange(passwordChangedDto: PasswordChangeDto, user: User) {
    const { oldPassword, newPassword, repeatPassword } = passwordChangedDto;
    if (user.password !== hashPwd(oldPassword, user.salt)) {
      throw new BadRequestException('Wrong password.');
    }
    if (newPassword !== repeatPassword) {
      throw new BadRequestException('Wrong repeat password.');
    }
    user.password = hashPwd(newPassword, user.salt);
    await user.save();
    await this.mailService.sendPassword(user.email, newPassword);

    return {
      statusCode: 200,
      message: 'We have sent password on email. Please log in.',
    };
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
    return { password, user, registerToken };
  }
}
