export function trimAndReturn(str: string, limit: number = 255): string {
  if (str.length > limit) {
    return str.substring(0, limit);
  }
  return str;
}
