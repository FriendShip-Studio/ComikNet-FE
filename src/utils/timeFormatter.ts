import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/zh-cn';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const datetimeFormatter = (datetime: string | undefined, keepTime: boolean = false): string => {

    if (!datetime) {
        return "未知时间";
    }

    const data = dayjs(datetime, "YYYY-MM-DD HH:mm:ss")
    const now = dayjs()

    if (now.diff(data, "h") > 24) {
        if (keepTime) {
            return data.format("YYYY-MM-DD HH:mm:ss");
        } else {
            return data.format("YYYY-MM-DD");
        }
    } else {
        return data.fromNow();
    }
}
