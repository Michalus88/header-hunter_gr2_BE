import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  papaparseToArrOfObj,
  validateImportedStudentData,
} from 'src/utils/csvParse';
import { multerStorage, storageDir } from 'src/utils/storage';
import { ImportedStudentData } from 'types';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ImportCsvAndValidateData implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const [req] = context.getArgs();
    const request = context.switchToHttp().getRequest();

    const csvFile = req.files.studentsList[0].path;
    let csvText = '';
    try {
      if (csvFile) {
        csvText = String(fs.readFileSync(csvFile));
      }
    } catch (e2) {
      throw e2;
    }

    const parseArr = papaparseToArrOfObj(csvText);

    const validateImportedStudentList: ImportedStudentData[] =
      validateImportedStudentData(parseArr);

    request.incorrectData = {
      number: 0,
      emails: [],
    };

    const incorrectData = parseArr
      .filter(function (o1) {
        return validateImportedStudentList.every(function (o2) {
          return o1 !== o2;
        });
      })
      .map((el) => {
        request.incorrectData.number++;
        return el.email;
      });

    // if (request.incorrectData.number > 0) {
    request.incorrectData.emails = incorrectData;
    // } else {
    //   delete request.incorrectData;
    // }

    request.importStudents = validateImportedStudentList;
    return next.handle();
  }
}
