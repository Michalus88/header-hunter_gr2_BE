import { Injectable } from '@nestjs/common';
import { BonusProjectUrl } from './student-bonus-project-url.entity';
import { ImportedStudentData } from 'types';

@Injectable()
export class StudentService {
  async addBonusProjectUrls(student: ImportedStudentData, userId: string) {
    for (const url of student.bonusProjectUrls) {
      const bonusProjectUrl = new BonusProjectUrl();
      bonusProjectUrl.userId = userId;
      bonusProjectUrl.url = url;
      await bonusProjectUrl.save();
    }
  }
}
