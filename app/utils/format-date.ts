import dayjs from "dayjs";

dayjs.locale("ko");

export const formatDate = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm");
};
