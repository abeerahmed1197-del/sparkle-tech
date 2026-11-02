import { describe, expect, it } from 'vitest';
import { addCompareId, collectSpecKeys, specRowDiffers, MAX_COMPARE } from '@/lib/compare';

describe('Compare selection rules', () => {
  it('adds a product and preserves the selection order', () => {
    expect(addCompareId([], 'a').ids).toEqual(['a']);
    expect(addCompareId(['a'], 'b').ids).toEqual(['a', 'b']);
  });

  it('toggling removes an already-selected product', () => {
    expect(addCompareId(['a', 'b'], 'a').ids).toEqual(['b']);
    expect(addCompareId(['a', 'b'], 'a').error).toBeNull();
  });

  it('refuses to compare more than four products', () => {
    const full = ['1', '2', '3', '4'].slice(0, MAX_COMPARE);
    const result = addCompareId(full, '5');
    expect(result.ids).toEqual(full);
    expect(result.error).toContain('4');
  });

  it('allows adding again after removing one', () => {
    const { ids } = addCompareId(['1', '2', '3', '4'], '5');
    expect(ids).toEqual(['1', '2', '3', '4']);
    const afterRemove = ids.filter(x => x !== '1');
    expect(addCompareId(afterRemove, '5').error).toBeNull();
  });
});

describe('Specification comparison helpers', () => {
  it('unions spec keys in first-seen order', () => {
    expect(collectSpecKeys([
      { Display: '6.1"', Chip: 'A18' },
      { Camera: '50MP', Display: '6.7"' },
    ])).toEqual(['Display', 'Chip', 'Camera']);
  });

  it('flags rows whose values differ, including missing values', () => {
    expect(specRowDiffers([{ Display: '6.1"' }, { Display: '6.7"' }], 'Display')).toBe(true);
    expect(specRowDiffers([{ RAM: '8GB' }, { RAM: '8GB' }], 'RAM')).toBe(false);
    expect(specRowDiffers([{ RAM: '8GB' }, {}], 'RAM')).toBe(true);
  });

  it('never flags a single product comparison', () => {
    expect(specRowDiffers([{ Display: '6.1"' }], 'Display')).toBe(false);
  });
});
