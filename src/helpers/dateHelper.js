import moment from 'moment';
import countriesDB from 'countries-db'
import momentTimeZone from 'moment-timezone';

export function getDateUsingTimeZone(country, dateFormat) {
    if (!country) return moment();
    else {
        let convertedDate;
        const timezones = countriesDB && countriesDB.getCountry(country, 'timezones');
        if (timezones && timezones.length > 0) {
            convertedDate = (timezones && timezones.length > 0) ? momentTimeZone.tz(timezones[0]) : null;
        }

        if (convertedDate && convertedDate != null) {
            if (dateFormat) {
                convertedDate = convertedDate.format('YYYY-MM-DD');
            }
            return convertedDate;
        } else {
            return moment();
        }
    }
}

export function setDateWithTimeZone(date, country) {
    if (!country || !date) return moment(date);

    let convertedDate;
    const timezones = countriesDB && countriesDB.getCountry(country, 'timezones');
    if (timezones && timezones.length > 0) {
        convertedDate = momentTimeZone.tz(date, timezones[0]);
    }

    return convertedDate || moment(date);
}

export function getDateRanges({ checkIn, country, checkOut }) {
    let startDate = setDateWithTimeZone(checkIn, country).startOf('day'),
        endDate = setDateWithTimeZone(checkOut, country).startOf('day'),
        today = getDateUsingTimeZone(country, false).startOf('day');
    return {
        nights: endDate.diff(startDate, 'days'),
        interval: startDate.diff(today, 'days'),
        today
    };
}