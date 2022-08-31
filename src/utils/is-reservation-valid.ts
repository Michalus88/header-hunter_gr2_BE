export const isReservationValid = (bookingDateTo: Date) => {
  const currentDate = new Date();
  const result = bookingDateTo.getTime() - currentDate.getTime();
  return !(result > 0);
};
