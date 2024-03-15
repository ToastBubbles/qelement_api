import { IIdAndNumber } from 'src/interfaces/general';

export function trimAndReturn(str: string, limit: number = 255): string {
  str = str.trim();
  if (str.length > limit) {
    return str.substring(0, limit);
  }
  return str;
}

export function validateImageType(str: string): boolean {
  if (
    str == 'part' ||
    str == 'supplemental' ||
    str == 'sculpture' ||
    str == 'damaged' ||
    str == 'other'
  )
    return true;
  return false;
}

export function validateQPartType(str: string): string {
  let output = str.trim();
  if (
    output == 'qelement' ||
    output == 'prototype' ||
    output == 'test' ||
    output == 'employee' ||
    output == 'nightshift' ||
    output == 'unknown'
  ) {
    return output;
  }
  return 'other';
}
export function validatePercentages(data: IIdAndNumber[]): boolean {
  let percentTotal = 0;
  let containsNulls = false;
  let containsInvalid = false;

  data.forEach((entry) => {
    if (entry.number == -1) {
      containsNulls = true;
      return;
    } else if (
      entry.number <= 0 ||
      entry.number >= 100 ||
      !isWholeNumber(entry.number)
    ) {
      containsInvalid = true;
    } else {
      percentTotal += entry.number;
    }
  });
  if (containsInvalid) {
    return false;
  }

  if (containsNulls && percentTotal === 0) {
    return true;
  }
  if (!containsNulls && percentTotal === 100) {
    return true;
  }

  return false;
}

function isWholeNumber(num: number) {
  return num % 1 === 0;
}


export function verifyKeywordsString(str: string): boolean {
  if (str.length == 0) return true;
  const pattern = /^[a-zA-Z0-9;]+$/;
  return pattern.test(str);
}
export function verifyKeyword(str: string): boolean {
  const pattern = /^[a-zA-Z0-9]+$/;
  return pattern.test(str);
}

export function validateYear(year: number | null): number | null {
  let min = 1932;
  let max = 2500;
  if (year == null || year < min || year > max) return null;
  return year;
}
