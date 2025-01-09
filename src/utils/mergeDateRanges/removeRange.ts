import moment from 'moment';

import { UnavailableDate } from '@/types';

const removeUnavailableRange = (
  removeDateRange: UnavailableDate,
  dateRanges: UnavailableDate[] = []
): UnavailableDate[] => {
  const removeFromDate = moment(
    typeof removeDateRange === 'string'
      ? removeDateRange
      : removeDateRange.from,
    'YYYY-MM-DD'
  );
  const removeToDate = moment(
    typeof removeDateRange === 'string' ? removeDateRange : removeDateRange.to,
    'YYYY-MM-DD'
  );

  const adjustedRanges: UnavailableDate[] = [];

  dateRanges.forEach((range) => {
    const rangeFrom = moment(
      typeof range === 'string' ? range : range.from,
      'YYYY-MM-DD'
    );
    const rangeTo = moment(
      typeof range === 'string' ? range : range.to,
      'YYYY-MM-DD'
    );

    // If the range to remove does not overlap with the current range, keep it as is
    if (rangeTo.isBefore(removeFromDate) || rangeFrom.isAfter(removeToDate)) {
      adjustedRanges.push(range);
    } else {
      // If the range to remove overlaps with the current range, adjust it
      if (rangeFrom.isBefore(removeFromDate)) {
        // Add the part before the range to remove starts
        adjustedRanges.push({
          from: typeof range === 'string' ? range : range.from,
          to: removeFromDate.clone().subtract(1, 'day').format('YYYY-MM-DD'),
        });
      }
      if (rangeTo.isAfter(removeToDate)) {
        // Add the part after the range to remove ends
        adjustedRanges.push({
          from: removeToDate.clone().add(1, 'day').format('YYYY-MM-DD'),
          to: typeof range === 'string' ? range : range.to,
        });
      }
    }
  });

  // Filter out the exact range to be removed
  return adjustedRanges.map((rg) =>
    typeof rg === 'string' ? rg : rg.from === rg.to ? rg.from : rg
  );
};

export default removeUnavailableRange;
