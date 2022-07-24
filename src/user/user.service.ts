import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import {
  papaparseToArrOfObj,
  validateImportedStudents,
} from 'src/utils/csvParse';
import { storageDir } from 'src/utils/storage';
import { MulterDiskUploadedFiles } from 'src/interfaces';
import { ImportedStudent } from 'types';

@Injectable()
export class UserService {
  addCSV(files: MulterDiskUploadedFiles): ImportedStudent[] {
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

    return validateImportedStudents(papaparseToArrOfObj(csvText));
  }
}
