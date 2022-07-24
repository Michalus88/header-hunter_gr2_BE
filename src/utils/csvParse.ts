import * as Papa from 'papaparse';
import { ImportedStudent } from 'types';

function validate(arr: ImportedStudent[]): ImportedStudent[] {
  return arr.filter((el) => {
    return (
      el.email.includes('@') &&
      !isNaN(el.courseCompletion) &&
      !isNaN(el.courseEngagment) &&
      !isNaN(el.projectDegree) &&
      !isNaN(el.teamProjectDegree) &&
      el.courseCompletion >= 0 &&
      el.courseCompletion <= 5 &&
      el.courseEngagment >= 0 &&
      el.courseEngagment <= 5 &&
      el.projectDegree >= 0 &&
      el.projectDegree <= 5 &&
      el.teamProjectDegree >= 0 &&
      el.teamProjectDegree <= 5 &&
      el.bonusProjectUrls.every((el2) => String(el2).includes('github.com'))
    );
  });
}

export function papaparseToArrOfObj(csvText: string): ImportedStudent[] {
  const csvObj = Papa.parse(csvText);

  const csvArrObj = [];

  for (let i = 1; i < csvObj.data.length - 1; i++) {
    const csvObjTmp = {
      email: csvObj.data[i][0],
      courseCompletion: Number(csvObj.data[i][1]),
      courseEngagment: Number(csvObj.data[i][2]),
      projectDegree: Number(csvObj.data[i][3]),
      teamProjectDegree: Number(csvObj.data[i][4]),
      bonusProjectUrls: csvObj.data[i][5].split(' '),
    };
    csvArrObj.push(csvObjTmp);
  }

  return validate(csvArrObj);
}
