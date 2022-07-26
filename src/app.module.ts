import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HrModule } from './hr/hr.module';
import { StudentModule } from './student/student.module';
import { User } from './user/user.entity';
import { StudentProfile } from './student/student-profile.entity';
import { StudentProjectUrl } from './student/student-project-url.entity';
import { StudentPortfolioUrl } from './student/student-portfolio-url.entity';
import { BonusProjectUrl } from './student/student-bonus-project-url.entity';
import { StudentGrades } from './student/student-grades.entity';
import { HrProfile } from './hr/hr-profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        BonusProjectUrl,
        HrProfile,
        User,
        StudentGrades,
        StudentPortfolioUrl,
        StudentProfile,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
