import { PROPERTY_STARTING_YEAR } from './constants';

const airbnbWorkingYears = (
  finishedYear = new Date().getFullYear()
): number[] => {
  const startedYear: number = PROPERTY_STARTING_YEAR;
  const years: number[] = [];

  for (let year: number = startedYear; year <= finishedYear; year++) {
    years.push(year);
  }

  return years;
};

export default airbnbWorkingYears;
