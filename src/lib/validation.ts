export const isValidPositiveInt = (subject: number): boolean =>
  typeof subject === 'number' && subject % 1 === 0 && subject > 0;
