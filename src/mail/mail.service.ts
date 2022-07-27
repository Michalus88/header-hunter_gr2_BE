import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivateLink(
    email: string,
    userId: string,
    registerToken: string,
    password: string,
  ) {
    const mail = {
      to: email,
      subject: 'Header Hunter account activation',
      from: 'headerhuntergr2@gmail.com',
      html: `<ul>
              <li><span>Activation link: </span> <a  href="http://localhost:3000/activate/${userId}/${registerToken}">Click here<\a></li>
              <li><span>First login password: </span><strong>${password}</strong> </li>
             </ul>`,
    };
    await this.mailerService.sendMail(mail);

    return {
      statusCode: 202,
      message: 'Activation successful! Check your email.',
    };
  }
}
