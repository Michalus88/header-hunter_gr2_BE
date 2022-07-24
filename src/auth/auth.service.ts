import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { hashPwd } from 'src/utils/hash-pwd';
// import { sanitizeUser } from 'src/utils/sanitize-user';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getByEmail(email);
    if (user && user.password === hashPwd(password, user.salt)) {
      return user;
      // return sanitizeUser(user);
    }
    return null;
  }

  login(user: User, res: Response) {
    const payload = { email: user.email };
    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    const oneDay = 1000 * 60 * 60 * 24;
    return res
      .cookie('jwt', token, {
        secure: false,
        // domain: 'localhost',
        httpOnly: true,
        maxAge: oneDay,
      })
      .json(user);
  }

  logout(res: Response) {
    res
      .clearCookie('jwt', {
        secure: false,
        // domain: 'localhost',
        httpOnly: true,
      })
      .json({ message: 'Logout was successful' });
  }
}
