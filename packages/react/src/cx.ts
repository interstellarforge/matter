/** Joins class names, skipping empty values. Consumer classes are always kept. */
export function cx(...names: (string | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}
