export const MAX_COMPARE = 4;

/**
 * Toggles a product id in the compare selection.
 * Returns the next selection plus a user-facing error when the limit is hit.
 */
export const addCompareId = (
  ids: string[],
  id: string,
  max: number = MAX_COMPARE,
): { ids: string[]; error: string | null } => {
  if (ids.includes(id)) return { ids: ids.filter(x => x !== id), error: null };
  if (ids.length >= max) return { ids, error: `You can compare up to ${max} products. Remove one to add another.` };
  return { ids: [...ids, id], error: null };
};

/** Union of specification keys across products, in first-seen order. */
export const collectSpecKeys = (specs: Record<string, string>[]): string[] => {
  const keys: string[] = [];
  specs.forEach(spec => {
    Object.keys(spec || {}).forEach(key => {
      if (!keys.includes(key)) keys.push(key);
    });
  });
  return keys;
};

/** A row differs when products disagree or some omit the value. */
export const specRowDiffers = (specs: Record<string, string>[], key: string): boolean => {
  if (specs.length < 2) return false;
  const values = specs.map(spec => String(spec?.[key] ?? '—'));
  return new Set(values).size > 1;
};
