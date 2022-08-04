import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HrModule } from './hr/hr.module';
import { StudentModule } from './student/student.module';
import { User } from './user/user.entity';
import { MailModule } from './mail/mail.module';
import { StudentProfile } from './student/student-profile.entity';
import { StudentProjectUrl } from './student/student-project-url.entity';
import { StudentPortfolioUrl } from './student/student-portfolio-url.entity';
import { BonusProjectUrl } from './student/student-bonus-project-url.entity';
import { HrProfile } from './hr/hr-profile.entity';
import { StudentInfo } from './student/student-info.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        BonusProjectUrl,
        HrProfile,
        User,
        StudentPortfolioUrl,
        StudentProfile,
        StudentInfo,
        StudentProjectUrl,
      ],
      bigNumberStrings: false,
      logging: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    HrModule,
    StudentModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
