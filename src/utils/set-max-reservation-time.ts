export const setMaxReservationTime = (timeInDay: number) => {
  const oneDayInMs = 60 * 1000 * 60 * 24;
  const currentDate = new Date();
  const bookedTo = currentDate.getTime() + oneDayInMs * timeInDay;
  return new Date(bookedTo);
};
