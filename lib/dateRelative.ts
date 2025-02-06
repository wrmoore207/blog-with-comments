// This function calculates the time difference from a given date to the present
// Converts a timestamp into a human-readable relative time
// ie: "5 minutes ago", "2 months ago", etc

import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";

export default function distanceToNow(dateTime: number | Date) {
  console.log("Received timestamp for formatting:", dateTime);

  if (!dateTime || isNaN(new Date(dateTime).getTime())) {
    console.error("Invalid date received:", dateTime);
    return "Unknown time";
  }

  // Convert UTC time to local Eastern Time
  const localTime = new Date(dateTime).toLocaleString("en-US", {
    timeZone: "America/New_York", // Convert UTC to Eastern Time
  });

  return formatDistanceToNowStrict(new Date(localTime), {
    addSuffix: true,
  });
}
