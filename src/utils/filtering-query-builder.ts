import { FilteringOptionsDto } from '../student/dto/filtering-options.dto';
import { BadRequestException } from '@nestjs/common';

export const filteringQueryBuilder = (
  filteringOptions: FilteringOptionsDto,
) => {
  let query = '';
  let salary = '';
  let salaryFrom: null | number = null;
  let salaryTo: null | number = null;
  for (const [key, value] of Object.entries(filteringOptions)) {
    if (value) {
      if (key === 'expectedSalaryFrom') {
        salaryFrom = value;
      } else if (key === 'expectedSalaryTo') {
        salaryTo = value;
      } else if (
        key === 'expectedContractType' ||
        key === 'canTakeApprenticeship' ||
        key === 'monthsOfCommercialExp'
      ) {
        query += ` AND sInfo.${key} = :${key}`;
      } else {
        query += ` AND student.${key} = :${key}`;
      }
    }
  }
  if (salaryFrom && salaryTo) {
    if (salaryFrom > salaryTo) {
      throw new BadRequestException(
        'The minimum salary cannot be greater than the maximum salary',
      );
    }
    salary = ` AND sInfo.expectedSalary BETWEEN ${salaryFrom} AND ${salaryTo}`;
  } else if (salaryFrom) {
    salary = ` AND sInfo.expectedSalary > ${salaryFrom}`;
  } else if (salaryTo) {
    salary = ` AND sInfo.expectedSalary <= ${salaryTo}`;
  }
  if (salary) {
    query += salary;
  }

  return query;
};
