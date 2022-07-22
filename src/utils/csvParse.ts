import * as Papa from 'papaparse';
import { ObjAfterCSVImport } from 'types';

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
    csvObjTmp.courseCompletion = csvObj.data[i][1];
    csvObjTmp.courseEngagment = csvObj.data[i][2];
    csvObjTmp.projectDegree = csvObj.data[i][3];
    csvObjTmp.teamProjectDegree = csvObj.data[i][4];
    csvObjTmp.bonusProjectUrls = csvObj.data[i][5];
    csvArrObj[i - 1] = csvObjTmp;
  }

  return csvArrObj;
}
