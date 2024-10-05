export function localTimeOfDay(date: Date) {
  return date.toLocaleTimeString(navigator.language, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function dateFromLocalTime(time: string) {
  return new Date(`1970-01-01 ${time}:00`);
}
