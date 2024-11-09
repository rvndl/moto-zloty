export const toFixedISOString = (date: Date) => {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
};
