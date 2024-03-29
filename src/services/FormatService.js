import { DateTime } from 'luxon';

export default {
  setCurrencyFormat: (number) =>
    new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number),

  setFullDateFormat: (date) =>
    DateTime.fromSQL(date)
      .setLocale('es-Es')
      .toLocaleString(DateTime.DATETIME_SHORT),

  setDateFormat: (date) =>
    DateTime.fromSQL(date)
      .setLocale('es-Es')
      .toLocaleString(DateTime.DATE_SHORT),

  setDateFormatYYYYmmdd: (date)  => {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
};
