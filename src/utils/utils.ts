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
