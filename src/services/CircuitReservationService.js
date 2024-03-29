import { DateTime } from 'luxon';
import LuxonDayNumbers from 'src/enums/LuxonDayNumbers';

export default {
  getTimeSlots(date) {
    const selectedDate = DateTime.fromFormat(date, 'dd/MM/yyyy');
    const $existDate = null;

    const morningRanges = [
      {
        name: '10:00 - 13:00',
        start: '10:00',
        end: '13:00',
      },
      {
        name: '10:30 - 13:30',
        start: '10:30',
        end: '13:30',
      },
      {
        name: '11:00 - 14:00',
        start: '11:00',
        end: '14:00',
        deferred_entry: '11:30'
      },
      {
        name: '12:00 - 15:00',
        start: '12:00',
        end: '15:00',
        deferred_entry: '12:30'
      },
    ];

    if (
      $existDate != null ||
      selectedDate.toFormat('c') === LuxonDayNumbers.SUNDAY
    ) {
      return [
        {
          name: '09:30 - 12:30',
          start: '09:30',
          end: '12:30',
        },
        ...morningRanges,
        {
          name: '13:00 - 15:00',
          start: '13:00',
          end: '15:00',
        },
      ];
    }

    const afternoonRanges = [
      {
        name: '13:00 - 16:00',
        start: '13:00',
        end: '16:00',
        deferred_entry: '13:30'
      },
      {
        name: '14:00 - 17:00',
        start: '14:00',
        end: '17:00',
        deferred_entry: '14:30'
      },
      {
        name: '15:00 - 18:00',
        start: '15:00',
        end: '18:00',
        deferred_entry: '15:30'
      },
      {
        name: '16:00 - 19:00',
        start: '16:00',
        end: '19:00',
        deferred_entry: '16:30'
      },
      {
        name: '17:00 - 20:00',
        start: '17:00',
        end: '20:00',
      },
      {
        name: '17:30 - 20:30',
        start: '17:30',
        end: '20:30',
      },
      {
        name: '18:00 - 21:00',
        start: '18:00',
        end: '21:00',
        deferred_entry: '18:30'
      },
    ];

    if (selectedDate.toFormat('c') === LuxonDayNumbers.SATURDAY) {
      return [
        {
          name: '09:30 - 12:30',
          start: '09:30',
          end: '12:30',
        },
        ...morningRanges,
        ...afternoonRanges,
        {
          name: '19:00 - 22:00',
          start: '19:00',
          end: '22:00',
        },
        {
          name: '20:00 - 22:00',
          start: '20:00',
          end: '22:00',
        },
      ];
    }

    return [
      ...morningRanges,
      ...afternoonRanges,
      {
        name: '19:00 - 21:00',
        start: '19:00',
        end: '21:00',
      },
    ];
  },
};
