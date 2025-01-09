import moment from 'moment';

import { SpecialPrice } from '@/types';

const removeRange = (
  removeDatePriceRange: SpecialPrice,
  datePriceRanges: SpecialPrice[] = []
): SpecialPrice[] => {
  const { from: removeFrom, to: removeTo } = removeDatePriceRange;
  const removeFromDate = moment(removeFrom);
  const removeToDate = moment(removeTo);

  const adjustedRanges: SpecialPrice[] = [];

  datePriceRanges.forEach((range) => {
    const rangeFrom = moment(range.from);
    const rangeTo = moment(range.to);

    // If the range to remove does not overlap with the current range, keep it as is
    if (rangeTo.isBefore(removeFromDate) || rangeFrom.isAfter(removeToDate)) {
      adjustedRanges.push(range);
    } else {
      // If the range to remove overlaps with the current range, adjust it
      if (rangeFrom.isBefore(removeFromDate)) {
        // Add the part before the range to remove starts
        adjustedRanges.push({
          from: range.from,
          price: range.price,
          to: removeFromDate.clone().subtract(1, 'day').format('YYYY-MM-DD'),
        });
      }
      if (rangeTo.isAfter(removeToDate)) {
        // Add the part after the range to remove ends
        adjustedRanges.push({
          from: removeToDate.clone().add(1, 'day').format('YYYY-MM-DD'),
          price: range.price,
          to: range.to,
        });
      }
    }
  });

  // Filter out the exact range to be removed
  return adjustedRanges;
};

export default removeRange;
