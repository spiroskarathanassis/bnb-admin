import { describe, expect, it } from 'vitest';

import removeRange from './removeRange';

describe('removeRange', () => {
  it('should merge date price ranges accordingly', () => {
    const datePriceRange1 = {
      from: '2024-11-19',
      price: 250,
      to: '2024-11-22',
    };
    const datePriceRanges = [
      {
        from: '2024-10-16',
        price: 200,
        to: '2024-10-17',
      },
      {
        from: '2024-11-18',
        price: 80,
        to: '2024-11-20',
      },
      {
        from: '2024-11-21',
        price: 250,
        to: '2024-11-24',
      },
    ];

    const result = removeRange(datePriceRange1, datePriceRanges);

    expect(result).toStrictEqual([
      {
        from: '2024-10-16',
        price: 200,
        to: '2024-10-17',
      },
      {
        from: '2024-11-18',
        price: 80,
        to: '2024-11-18',
      },
      {
        from: '2024-11-23',
        price: 250,
        to: '2024-11-24',
      },
    ]);
  });

  it('should merge date price ranges accordingly by updating and splitting ranges with diff prices', () => {
    const datePriceRange2 = {
      from: '2024-11-20',
      price: 300,
      to: '2024-11-20',
    };
    const datePriceRanges = [
      {
        from: '2024-10-16',
        price: 200,
        to: '2024-10-17',
      },
      {
        from: '2024-11-18',
        price: 80,
        to: '2024-11-20',
      },
      {
        from: '2024-11-21',
        price: 250,
        to: '2024-11-24',
      },
    ];

    const result = removeRange(datePriceRange2, datePriceRanges);

    expect(result).toStrictEqual([
      {
        from: '2024-10-16',
        price: 200,
        to: '2024-10-17',
      },
      {
        from: '2024-11-18',
        price: 80,
        to: '2024-11-19',
      },
      {
        from: '2024-11-21',
        price: 250,
        to: '2024-11-24',
      },
    ]);
  });

  it('should merge date price ranges accordingly', () => {
    const datePriceRange1 = {
      from: '2024-10-16',
      price: 250,
      to: '2024-10-16',
    };
    const datePriceRanges = [
      {
        from: '2024-10-16',
        price: 200,
        to: '2024-10-16',
      },
      {
        from: '2024-11-18',
        price: 80,
        to: '2024-11-20',
      },
    ];

    const result = removeRange(datePriceRange1, datePriceRanges);

    expect(result).toStrictEqual([
      {
        from: '2024-11-18',
        price: 80,
        to: '2024-11-20',
      },
    ]);
  });
});
