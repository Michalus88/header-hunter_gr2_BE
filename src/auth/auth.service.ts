import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { hashPwd } from 'src/utils/hash-pwd';
import { sanitizeUser } from '../utils/sanitize-user';
import { stringToBoolean } from '../utils/string-to-boolean';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    if (user && user.password === hashPwd(password, user.salt)) {
      return user;
    }
    return null;
  }

  login(user: User, res: Response) {
    const payload = { email: user.email };
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    const oneDay = 1000 * 60 * 60 * 24;
    if (!user.isActive) {
      throw new BadRequestException(
        'Your account is inactive. Please check Your mail and click to activation link.',
      );
    }
    return res
      .cookie('jwt', token, {
        secure: false,
        domain: process.env.DOMAIN,
        httpOnly: stringToBoolean(process.env.COOKIE_SECURE),
        maxAge: oneDay,
      })
      .json(sanitizeUser(user));
  }

  logout(res: Response, responseObj?: { statusCode: number; message: string }) {
    const resObj = responseObj ?? { message: 'Logout was successful' };
    return res
      .clearCookie('jwt', {
        secure: false,
        domain: process.env.DOMAIN,
        httpOnly: stringToBoolean(process.env.COOKIE_SECURE),
      })
      .json(resObj);
  }
}
