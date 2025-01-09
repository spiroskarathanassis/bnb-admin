import { describe, expect, it } from 'vitest';

import removeRange from './removeRange';

describe('removeRange', () => {
  it('should merge date ranges accordingly', () => {
    const datePriceRange1 = { from: '2024-11-19', to: '2024-11-22' };
    const datePriceRanges = [
      { from: '2024-10-16', to: '2024-10-17' },
      { from: '2024-11-18', to: '2024-11-20' },
    ];

    const result = removeRange(datePriceRange1, datePriceRanges);

    expect(result).toStrictEqual([
      { from: '2024-10-16', to: '2024-10-17' },
      '2024-11-18',
    ]);
  });

  it('should merge date ranges accordingly', () => {
    const datePriceRange1 = '2024-10-16';
    const datePriceRanges = [
      '2024-10-16',
      { from: '2024-11-18', to: '2024-11-20' },
    ];

    const result = removeRange(datePriceRange1, datePriceRanges);

    expect(result).toStrictEqual([{ from: '2024-11-18', to: '2024-11-20' }]);
  });

  it('should merge date ranges accordingly', () => {
    const datePriceRange1 = '2024-10-16';
    const datePriceRanges = [
      { from: '2024-10-16', to: '2024-10-18' },
      { from: '2024-11-19', to: '2024-11-20' },
    ];

    const result = removeRange(datePriceRange1, datePriceRanges);

    expect(result).toStrictEqual([
      { from: '2024-10-17', to: '2024-10-18' },
      { from: '2024-11-19', to: '2024-11-20' },
    ]);
  });
});
