export function sortAlphabeticallyLogic(a: string, b: string) {
  const num1 = a.toLowerCase().charCodeAt(0);
  const num2 = b.toLowerCase().charCodeAt(0);
  return num1 > num2 ? 1 : -1;
}


