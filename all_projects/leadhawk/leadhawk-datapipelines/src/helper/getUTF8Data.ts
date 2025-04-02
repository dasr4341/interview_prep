function recursiveReplace(currentObj: any) {
  if (typeof currentObj === "object" && currentObj !== null) {
    for (let key in currentObj) {
      if (typeof currentObj[key] === "object") {
        recursiveReplace(currentObj[key]);
      } else if (typeof currentObj[key] === "string") {
        currentObj[key] = currentObj[key].replaceAll(/[^\x00-\x7F]/g, "");
      }
    }
  }
}

export const sanitizeObj = (data: string) => {
  const parseData = JSON.parse(data);
  recursiveReplace(parseData);
  return parseData;
};

export const sanitizeString = (string: string) => {
  try {
    return string.replaceAll(/[^\x00-\x7F]/g, "")
  } catch (e) {
    console.log("sanitizeString is throwing error", e);
    return string;
  }
};
