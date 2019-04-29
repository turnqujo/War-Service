export const isPositiveWholeNumber = (subject: number): boolean => {
  const isNumberType = typeof subject === 'number';
  const isOnlyNumbers = /^([0-9]+)$/.test(String(subject));
  const isWhole = subject % 1 === 0;
  const isPositive = subject > 0;

  return isNumberType && isOnlyNumbers && isWhole && isPositive;
}
