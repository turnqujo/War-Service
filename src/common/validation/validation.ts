export const isPositiveWholeNumber = (subject: number): boolean => {
  const isNumberType = typeof subject === 'number';
  if (!isNumberType) return false;

  const isOnlyNumbers = /^([0-9]+)$/.test(String(subject));
  if (!isOnlyNumbers) return false;

  return true;
}
