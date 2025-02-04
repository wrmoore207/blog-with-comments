import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

// This function calculates the time difference from a given date to the present
// Converts a timestamp into a human-readable relative time
// ie: "5 minutes ago", "2 months ago", etc
export default function distanceToNow(dateTime: number | Date) {
  return formatDistanceToNowStrict(dateTime, {
    addSuffix: true, // Adds "ago" or "in" to indicate past or future
  });
}
