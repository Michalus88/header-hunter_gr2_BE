import { BadRequestException } from '@nestjs/common';
import * as Papa from 'papaparse';
import { ImportedStudentData } from 'types';

export function validateImportedStudentData(
  arr: ImportedStudentData[],
): ImportedStudentData[] {
  if (!Array.isArray(arr) || arr.length == 0) return [];

  try {
    return arr.filter((el) => {
      return (
        el.email.includes('@') &&
        !isNaN(el.courseCompletion) &&
        !isNaN(el.courseEngagement) &&
        !isNaN(el.projectDegree) &&
        !isNaN(el.teamProjectDegree) &&
        el.courseCompletion >= 0 &&
        el.courseCompletion <= 5 &&
        el.courseEngagement >= 0 &&
        el.courseEngagement <= 5 &&
        el.projectDegree >= 0 &&
        el.projectDegree <= 5 &&
        el.teamProjectDegree >= 0 &&
        el.teamProjectDegree <= 5 &&
        el.bonusProjectUrls.every((el2) => String(el2).includes('github.com'))
      );
    });
  } catch {
    throw new BadRequestException('Invalid file format.');
  }
}

export function papaparseToArrOfObj(csvText: string): ImportedStudentData[] {
  const csvObj = Papa.parse(csvText);

  if (csvObj.errors.length > 0) {
    throw new BadRequestException('Invalid file format.');
  }

  const csvArrObj = [];

  for (let i = 1; i < csvObj.data.length - 1; i++) {
    const csvObjTmp = {
      email: csvObj.data[i][0],
      courseCompletion: Number(csvObj.data[i][1]),
      courseEngagement: Number(csvObj.data[i][2]),
      projectDegree: Number(csvObj.data[i][3]),
      teamProjectDegree: Number(csvObj.data[i][4]),
      bonusProjectUrls: csvObj.data[i][5].split(' '),
    };
    csvArrObj.push(csvObjTmp);
  }

  return csvArrObj;
}
