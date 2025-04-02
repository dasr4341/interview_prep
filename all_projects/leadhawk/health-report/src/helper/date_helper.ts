export const date_helper = {
  get_dates_between: (start_date: Date, end_date: Date) => {
    const currentDate = new Date(start_date.getTime());
    const dates = [];
    while (currentDate <= end_date) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  },

  end_of_day: (date: Date) => {
    const _date = new Date(date);
    _date.setUTCHours(23, 59, 59, 999);

    return _date;
  },

  start_of_day: (date: Date) => {
    const _date = new Date(date);
    _date.setUTCHours(0, 0, 0, 0);

    return _date;
  },

  add_seconds: (date: Date, seconds: number) => {
    const _date = new Date(date);
    _date.setSeconds(_date.getSeconds() + seconds);

    return _date;
  },
};
