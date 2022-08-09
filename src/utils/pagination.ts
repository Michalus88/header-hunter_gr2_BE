import { AvailableStudentRes, AvailableStudentWhitPaginationRes } from 'types';

export const pagination = (
  arr: AvailableStudentRes[],
  maxPerPage = 5,
  currentPage = 1,
): AvailableStudentWhitPaginationRes => {
  const studentsCount = arr.length;
  const totalPages = Math.ceil(studentsCount / maxPerPage);
  const paginationArr = arr.slice(
    maxPerPage * (currentPage - 1),
    maxPerPage * (currentPage - 1) + maxPerPage,
  );
  return {
    students: paginationArr,
    pages: { maxPerPage, currentPage, studentsCount, totalPages },
  };
};
