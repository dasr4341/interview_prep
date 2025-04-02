export function textComparator(text1: string, text2: string) {

  const lowerA = text1?.toLowerCase();
  const lowerB = text2?.toLowerCase();

  if (lowerA < lowerB) {
    return -1;
  } else if (lowerA > lowerB) {
    return 1;
  } else {
    return 0;
  }
}

export function textComparatorOfReport(text1: any, text2: any) {

  const lowerA = text1?.value?.toLowerCase();
  const lowerB = text2?.value?.toLowerCase();

  if (lowerA < lowerB) {
    return -1;
  } else if (lowerA > lowerB) {
    return 1;
  } else {
    return 0;
  }
}

