import moment from 'moment';

import { SpecialPrice } from '@/types';

const mergeNewRange = (
  newDatePriceRange: SpecialPrice,
  datePriceRanges: SpecialPrice[] = []
): SpecialPrice[] => {
  const { from: newFrom, to: newTo, price: newPrice } = newDatePriceRange;
  const newFromDate = moment(newFrom);
  const newToDate = moment(newTo);

  // Step 1: Collect all overlapping ranges
  const overlappingRanges = datePriceRanges.filter((range) => {
    const rangeFrom = moment(range.from);
    const rangeTo = moment(range.to);
    return (
      rangeTo.isSameOrAfter(newFromDate) && rangeFrom.isSameOrBefore(newToDate)
    );
  });

  // Step 2: Keep non-overlapping ranges (the ones that don't need adjustment)
  const untouchedRanges = datePriceRanges.filter((range) => {
    const rangeFrom = moment(range.from);
    const rangeTo = moment(range.to);
    return rangeTo.isBefore(newFromDate) || rangeFrom.isAfter(newToDate);
  });

  const adjustedRanges: SpecialPrice[] = [];

  // Step 3: Process overlapping ranges
  overlappingRanges.forEach((range) => {
    const rangeFrom = moment(range.from);
    const rangeTo = moment(range.to);

    // Case 1: If range price is different, adjust the range by splitting it
    if (range.price !== newPrice) {
      if (rangeFrom.isBefore(newFromDate)) {
        // Add the part before the new range starts
        adjustedRanges.push({
          from: range.from,
          price: range.price,
          to: newFromDate.clone().subtract(1, 'day').format('YYYY-MM-DD'),
        });
      }
      if (rangeTo.isAfter(newToDate)) {
        // Add the part after the new range ends
        adjustedRanges.push({
          from: newToDate.clone().add(1, 'day').format('YYYY-MM-DD'),
          price: range.price,
          to: range.to,
        });
      }
    } else {
      // Case 2: If range price is the same, adjust the range by extending it
      adjustedRanges.push({
        from: moment.min(rangeFrom, newFromDate).format('YYYY-MM-DD'),
        price: range.price,
        to: moment.max(rangeTo, newToDate).format('YYYY-MM-DD'),
      });
    }
  });

  // Step 4: Add the new range itself
  adjustedRanges.push({
    from: newFrom,
    price: newPrice,
    to: newTo,
  });

  // Step 5: Merge untouched ranges and adjusted ranges
  const mergedRanges = [...untouchedRanges, ...adjustedRanges].sort((a, b) =>
    moment(a.from).diff(moment(b.from), 'days')
  );

  // Step 6: Merge adjacent ranges with the same price
  const finalRanges: SpecialPrice[] = [];
  let currentRange = mergedRanges[0];

  for (let i = 1; i < mergedRanges.length; i++) {
    const nextRange = mergedRanges[i];

    // If the current range can be merged with the next one (same price and adjacent)
    if (
      currentRange.price === nextRange.price &&
      moment(nextRange.from).diff(currentRange.to, 'days') <= 1
    ) {
      currentRange.to = moment
        .max(
          moment(nextRange.to, 'YYYY-MM-DD'),
          moment(currentRange.to, 'YYYY-MM-DD')
        )
        .format('YYYY-MM-DD'); // Extend the current range
    } else {
      // Otherwise, push the current range and start a new one
      finalRanges.push(currentRange);
      currentRange = nextRange;
    }
  }

  // Push the last range
  finalRanges.push(currentRange);

  return finalRanges;
};

export default mergeNewRange;
