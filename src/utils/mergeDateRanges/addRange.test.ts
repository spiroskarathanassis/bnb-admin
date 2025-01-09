import { describe, expect, it } from 'vitest';

import addRange from './addRange';

describe('addRange', () => {
  it('should merge ranges accordingly', () => {
    const datePriceRange1 = { from: '2024-11-19', to: '2024-11-22' };
    const datePriceRanges = [
      { from: '2024-10-16', to: '2024-10-17' },
      { from: '2024-11-18', to: '2024-11-24' },
    ];

    const result = addRange(datePriceRange1, datePriceRanges);

    expect(result).toStrictEqual([
      { from: '2024-10-16', to: '2024-10-17' },
      { from: '2024-11-18', to: '2024-11-24' },
    ]);
  });

  it('should merge ranges if adding right before an existing range', () => {
    const datePriceRange1 = { from: '2024-11-10', to: '2024-11-17' };
    const datePriceRanges = [
      { from: '2024-10-16', to: '2024-10-17' },
      { from: '2024-11-18', to: '2024-11-20' },
    ];

    const result = addRange(datePriceRange1, datePriceRanges);

    expect(result).toStrictEqual([
      { from: '2024-10-16', to: '2024-10-17' },
      { from: '2024-11-10', to: '2024-11-20' },
    ]);
  });

  it('should merge ranges if adding right after an existing range', () => {
    const datePriceRange1 = { from: '2024-11-21', to: '2024-11-22' };
    const datePriceRanges = [
      '2024-10-16',
      { from: '2024-11-18', to: '2024-11-20' },
    ];

    const result = addRange(datePriceRange1, datePriceRanges);

    expect(result).toStrictEqual([
      '2024-10-16',
      { from: '2024-11-18', to: '2024-11-22' },
    ]);
  });

  it('should merge ranges accordingly', () => {
    const datePriceRange1 = { from: '2024-11-10', to: '2024-11-22' };
    const datePriceRanges = [
      '2024-10-16',
      { from: '2024-11-18', to: '2024-11-20' },
    ];

    const result = addRange(datePriceRange1, datePriceRanges);

    expect(result).toStrictEqual([
      '2024-10-16',
      { from: '2024-11-10', to: '2024-11-22' },
    ]);
  });
});
