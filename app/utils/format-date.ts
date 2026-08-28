import dayjs from "dayjs";

dayjs.locale("ko");

export const formatDate = (
  date: string,
  format: string = "YYYY.MM.DD HH:mm"
) => {
  return dayjs(date).format(format);
};
