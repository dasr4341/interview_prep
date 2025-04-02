export const pluralize = (count: number) => `${count} ${count > 1 ? 'Days' : 'Day'}`;

export const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    }
  );
};
