const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatTimestamp = (timestamp?: string | number | null) => {
  if (timestamp === undefined || timestamp === null || timestamp === "") return "";

  // Accept numbers (ms or seconds) and strings. Try to produce a valid Date.
  let date: Date;
  if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else if (/^\d+$/.test(timestamp)) {
    // numeric string: could be seconds or milliseconds
    const asNum = Number(timestamp);
    date = new Date(asNum);
    if (isNaN(date.getTime())) {
      // try interpreting as seconds
      date = new Date(asNum * 1000);
    }
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) {
    // Fallback: return the raw timestamp string for visibility
    return String(timestamp);
  }

  try {
    return dateFormatter.format(date);
  } catch {
    // If Intl or formatting fails for any reason, return a safe fallback
    return String(timestamp);
  }
};

