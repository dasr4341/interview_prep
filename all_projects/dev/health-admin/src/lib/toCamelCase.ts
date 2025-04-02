export function toCamelCase(inputString: string) {
  // Remove non-alphanumeric characters except for spaces and hyphens
  const cleanedString = inputString.replace(/[^a-zA-Z0-9\s-]/g, '');

  // Convert to lowercase and split by spaces or hyphens
  const words = cleanedString.toLowerCase().split(/[\s-]+/);

  // Capitalize the first letter of each word (except the first word)
  const camelCaseWords = words.map((word, index) =>
    index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Join the words to form the camelCase string
  const camelCaseString = camelCaseWords.join('');

  return camelCaseString;
}