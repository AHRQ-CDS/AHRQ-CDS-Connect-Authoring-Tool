export function isInteger(number) {
  return Number.isInteger(parseFloat(number)) && !number.endsWith('.0');
}
