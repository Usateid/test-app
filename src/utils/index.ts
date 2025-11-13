export function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function formatDateYearMonthDay(date: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatPrice(price: number) {
  return price.toFixed(2);
}

export function formatDateRange(fromDate: Date, toDate: Date) {
  return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
}
