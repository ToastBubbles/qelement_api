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
