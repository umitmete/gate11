import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Varsayılan zaman dilimi yönetimi.
// Mantık işlemleri için öncelikle .utc() kullanılacaktır.

export default dayjs;
