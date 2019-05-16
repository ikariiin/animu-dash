export function monthToMonthStrMap(month: number) {
  const map = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return map[month - 1];
}