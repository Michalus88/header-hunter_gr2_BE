import * as Papa from 'papaparse';
import { ObjAfterCSVImport } from 'types';

function validate(arr: ObjAfterCSVImport[]): ObjAfterCSVImport[] {
  return arr.filter((el) => {
    return (
      el.email.includes('@') &&
      !isNaN(el.courseCompletion) &&
      !isNaN(el.courseEngagment) &&
      !isNaN(el.projectDegree) &&
      el.bonusProjectUrls.includes('https://github.com/')
    );
  });
}

export function papaparseToArrOfObj(csvText: string): ObjAfterCSVImport[] {
  const csvObj = Papa.parse(csvText);
  let csvObjTmp: ObjAfterCSVImport = {
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
    csvObjTmp.courseCompletion = Number(csvObj.data[i][1]);
    csvObjTmp.courseEngagment = Number(csvObj.data[i][2]);
    csvObjTmp.projectDegree = Number(csvObj.data[i][3]);
    csvObjTmp.teamProjectDegree = Number(csvObj.data[i][4]);
    csvObjTmp.bonusProjectUrls = csvObj.data[i][5];
    csvArrObj[i - 1] = csvObjTmp;
  }

  return validate(csvArrObj);
}
