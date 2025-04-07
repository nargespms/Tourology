export function formatPrice(price: number) {
  // to CAD
  return `${price.toFixed(0)} CAD`;
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);

  // if is less than 6 months ago use relative time
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  if (date > sixMonthsAgo) {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function pluralize(count: number, noun: string) {
  return `${count} ${noun}${count !== 1 ? "s" : ""}`;
}

export function capitalize(input: string) {
  if (!input) return "";
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
