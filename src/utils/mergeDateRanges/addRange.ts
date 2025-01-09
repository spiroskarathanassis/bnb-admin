import moment from 'moment';

import { UnavailableDate } from '@/types';

const fromToRange = (range: UnavailableDate) => ({
  from: typeof range === 'string' ? range : range.from,
  to: typeof range === 'string' ? range : range.to,
});

// Function to merge two overlapping ranges
const addRange = (
  newDateRange: UnavailableDate,
  dateRanges: UnavailableDate[]
): UnavailableDate[] => {
  const { from: newFrom, to: newTo } = fromToRange(newDateRange);
  const newFromDate = moment(newFrom);
  const newToDate = moment(newTo);

  // Step 1: Collect all overlapping ranges
  const overlappingRanges = dateRanges
    .map((el) => fromToRange(el))
    .filter((range) => {
      const rangeFrom = moment(range.from);
      const rangeTo = moment(range.to);
      return (
        rangeTo.isSameOrAfter(newFromDate) &&
        rangeFrom.isSameOrBefore(newToDate)
      );
    });

  // Step 2: Keep non-overlapping ranges (the ones that don't need adjustment)
  const untouchedRanges = dateRanges
    .map((el) => fromToRange(el))
    .filter((range) => {
      const rangeFrom = moment(range.from);
      const rangeTo = moment(range.to);
      return rangeTo.isBefore(newFromDate) || rangeFrom.isAfter(newToDate);
    });

  const adjustedRanges: UnavailableDate[] = [];

  // Step 3: Process overlapping ranges
  overlappingRanges.forEach((range) => {
    const rangeFrom = moment(range.from);
    const rangeTo = moment(range.to);

    // Case 2: If range price is the same, adjust the range by extending it
    adjustedRanges.push({
      from: moment.min(rangeFrom, newFromDate).format('YYYY-MM-DD'),
      to: moment.max(rangeTo, newToDate).format('YYYY-MM-DD'),
    });
  });

  // Step 4: Add the new range itself
  adjustedRanges.push({
    from: newFrom,
    to: newTo,
  });

  // Step 5: Merge untouched ranges and adjusted ranges
  const mergedRanges = [...untouchedRanges, ...adjustedRanges]
    .map((el) => fromToRange(el))
    .sort((a, b) => moment(a.from).diff(moment(b.from), 'days'));

  // Step 6: Merge adjacent ranges with the same price
  const finalRanges: UnavailableDate[] = [];
  let currentRange = mergedRanges[0];

  for (let i = 1; i < mergedRanges.length; i++) {
    const nextRange = mergedRanges[i];

    // If the current range can be merged with the next one (same price and adjacent)
    if (moment(nextRange.from).diff(currentRange.to, 'days') <= 1) {
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

  const mappedRanges = finalRanges.map((rg) =>
    typeof rg === 'string' ? rg : rg.from === rg.to ? rg.from : rg
  );

  return mappedRanges;
};

export default addRange;
