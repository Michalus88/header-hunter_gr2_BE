export const stringToBoolean = (stringValue) => {
  switch (stringValue?.toLowerCase()?.trim()) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return false;
  }
};
