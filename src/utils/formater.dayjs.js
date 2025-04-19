const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const localizedFormat = require('dayjs/plugin/localizedFormat');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const relativeTime = require('dayjs/plugin/relativeTime');
require('dayjs/locale/vi');

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);


dayjs.locale('vi');

// ========== Formatters ==========
const formatDate = (date, format = 'DD/MM/YYYY') => dayjs(date).format(format);
const formatTime = (date, format = 'HH:mm') => dayjs(date).format(format);
const formatDateTime = (date) => dayjs(date).format('HH:mm DD/MM/YYYY');
const formatRelative = (date) => dayjs(date).fromNow();


const toUTC = (date) => dayjs(date).utc().format();
const toLocal = (date, tz = 'Asia/Ho_Chi_Minh') => dayjs.utc(date).tz(tz).format('HH:mm DD/MM/YYYY');

module.exports = {
    formatDate,
    formatTime,
    formatDateTime,
    formatRelative,
    toUTC,
    toLocal,
};
