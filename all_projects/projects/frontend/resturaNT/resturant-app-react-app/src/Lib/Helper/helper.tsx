export const getDate = (currentDate: Date, previousDate: Date) => {
  // this is a function which will calculate -> (how much time has being passed between the previousdate and currentdate parameters)
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let resultDate = `${monthNames[previousDate.getMonth()]}
               ${previousDate.getDate()},
               ${
                 previousDate.getHours() > 12 ? previousDate.getHours() - 12 : previousDate.getHours()
               }:${previousDate.getMinutes()} ${previousDate.getHours() > 12 ? 'PM' : 'AM'}  `;

  if (
    previousDate.getDate() === currentDate.getDate() &&
    previousDate.getMonth() === currentDate.getMonth() &&
    currentDate.getFullYear() === previousDate.getFullYear()
  ) {
    const diffInMinutes = Math.round((currentDate.getTime() - previousDate.getTime()) / 60000);

    if (diffInMinutes === 0) {
      resultDate = 'Ordered Now';
    } else if (diffInMinutes > 60) {
      const diffInHour = Math.round(diffInMinutes / 60);
      resultDate = diffInHour > 1 ? diffInHour + ' hours ago ' : diffInHour + ' hour ago';
    } else {
      resultDate = diffInMinutes + ' minutes ago';
    }
  }

  return resultDate;
};





