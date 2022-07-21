import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { MulterDiskUploadedFiles } from 'types';
import { csvParse } from 'src/utils/csvParse';
import { storageDir } from 'src/utils/storage';

@Injectable()
export class UserService {
  addCSV(files: MulterDiskUploadedFiles): any {
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
    const csvObj = csvParse(csvText);
    let csvObjTmp = {
      email: '',
      courseCompletion: 0,
      courseEngagment: 0,
      projectDegree: 0,
      teamProjectDegree: 0,
      bonusProjectUrls: '',
    };
    const csvArrObj = [];

    for (let i = 1; i < csvObj.data.length - 1; i++) {
      csvObjTmp = {
        email: '',
        courseCompletion: 0,
        courseEngagment: 0,
        projectDegree: 0,
        teamProjectDegree: 0,
        bonusProjectUrls: '',
      };
      csvObjTmp.email = csvObj.data[i][0];
      csvObjTmp.courseCompletion = csvObj.data[i][1];
      csvObjTmp.courseEngagment = csvObj.data[i][2];
      csvObjTmp.projectDegree = csvObj.data[i][3];
      csvObjTmp.teamProjectDegree = csvObj.data[i][4];
      csvObjTmp.bonusProjectUrls = csvObj.data[i][5];
      csvArrObj[i - 1] = csvObjTmp;
    }

    return csvArrObj;
  }
}
