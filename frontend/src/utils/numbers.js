export function isInteger(number) {
  return Number.isInteger(parseFloat(number)) && !/\.0+$/.test(number);
}
