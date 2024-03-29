import { DateTime, Interval } from 'luxon';

export default {
  createDate: (date) => DateTime.fromSQL(date),
  getMinutesBetweenDates: (from, to) => {
    const interval = Interval.fromDateTimes(from, to);

    return interval.length('minutes');
  }
};
