import { DateTime } from 'luxon';

export function parseDateTime(date) {
   try {
      const parsedDate = DateTime
         .fromRFC2822(date)
         .setZone('Europe/Paris')
         .minus({ hours: 1 });
      return parsedDate.toFormat('dd/MM/yyyy HH:mm');
   } catch (error) {
      return "";
   }
}

export function parseDate(date) {
   try {
      const parsedDate = DateTime.fromRFC2822(date);
      return parsedDate.toFormat('dd/MM/yyyy');
   } catch (error) {
      return "";
   }
}

export function parseDateTimeInterval(date1, date2) {
   try {
      if(date2 === null) {
         return parseDateTime(date1);
      }
      return parseDateTime(date1) + " - " + DateTime.fromRFC2822(date2).toFormat('HH:mm');
   } catch (error) {
      return "";
   }
}