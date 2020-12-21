export const formatDates = (date: Date) =>
  new Intl.DateTimeFormat(navigator.language, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
