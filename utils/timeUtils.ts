import { BranchOperatingHours } from "~/constants/types/models/store";
import { Iso8601DateTimeFormat } from "~/constants/types/utilTypes";
import { iso8601Regex } from "./validationUtils";

export const debounceTime = 700;
export const requestTimeout = 70000;

/**
 * Converts an ISO 8601 date string to a JavaScript Date object.
 * Returns undefined if the input is invalid or null/undefined.
 */
export const parseIsoDateString = (
  isoString: string | null | undefined,
): Date | undefined => {
  if (!isoString) return undefined;
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * Converts a JavaScript Date object to an ISO 8601 string.
 * Returns undefined if the input is invalid or null/undefined.
 */
export const formatDateToIsoString = (
  date: Date | null | undefined,
): string | undefined => {
  return date instanceof Date && !isNaN(date.getTime())
    ? date.toISOString()
    : undefined;
};

/**
 * Validates if a string is in a valid ISO 8601 date-time format.
 */
export function isIsoDateString(isoString: string): boolean {
  return iso8601Regex.test(isoString);
}

/**
 * Formats an ISO 8601 date string into a readable date-time format
 * (e.g., "06/11/2024 10:45 AM").
 * Assumes en-GB format.
 */
export function formatIsoToReadable(dateTime: Iso8601DateTimeFormat): string {
  const dateObj = new Date(dateTime);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
    dateObj,
  );

  return formattedDate.replace(",", ""); // Removes comma if present
}

/**
 * Formats a date as a relative time string based on the current date
 * (e.g., "3 minutes ago", "yesterday", "Oct 6").
 */
export const formatToRelativeTime = (
  isoDateTime: Iso8601DateTimeFormat,
): string => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const ONE_HOUR_MS = 60 * 60 * 1000;
  const dateObj = new Date(isoDateTime);
  const currentDate = new Date();

  const timeDiff = currentDate.getTime() - dateObj.getTime();
  const diffDays = Math.floor(timeDiff / ONE_DAY_MS);
  const diffHours = Math.floor(timeDiff / ONE_HOUR_MS);

  // Format as relative time
  if (diffDays === 0) {
    if (timeDiff <= ONE_HOUR_MS) {
      const diffMinutes = Math.floor(timeDiff / (60 * 1000));
      return diffMinutes === 0
        ? "few seconds ago"
        : diffMinutes === 1
          ? "a minute ago"
          : `${diffMinutes} minutes ago`;
    } else {
      return diffHours === 1 ? "an hour ago" : `${diffHours} hours ago`;
    }
  }

  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    ...(dateObj.getFullYear() !== currentDate.getFullYear() && {
      year: "numeric",
    }),
  };

  return dateObj.toLocaleDateString(undefined, options);
};

/**
 * Formats an ISO 8601 date string to a custom format
 * (e.g., "06/11/2024 10:45") and provides parsed Date objects.
 */
export function formatIsoToCustomFormat(isoDateString: Iso8601DateTimeFormat): {
  isoDate: Date;
  formattedDate: string;
} {
  const isoDate = new Date(isoDateString);

  const day = String(isoDate.getUTCDate()).padStart(2, "0");
  const month = String(isoDate.getUTCMonth() + 1).padStart(2, "0");
  const year = isoDate.getUTCFullYear();
  const hours = String(isoDate.getUTCHours()).padStart(2, "0");
  const minutes = String(isoDate.getUTCMinutes()).padStart(2, "0");

  return {
    isoDate,
    formattedDate: `${day}/${month}/${year} ${hours}:${minutes}`,
  };
}

/**
 * Combines both exact time in "hh:mm AM/PM" format and relative time
 * (e.g., "10:45 AM (3 hours ago)").
 */
export const formatToExactAndRelativeTime = (
  isoDateTime: Iso8601DateTimeFormat,
): string => {
  const timeString = new Date(isoDateTime)
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  return `${timeString} (${formatToRelativeTime(isoDateTime)})`;
};

/**
 * Converts a Date object or ISO date string to ISO 8601 format.
 * If input is invalid, throws an error.
 */
export function ensureIso8601(dateInput: Date | string): Iso8601DateTimeFormat {
  const dateObj =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date input. Provide a valid Date or ISO string.");
  }

  return dateObj.toISOString() as Iso8601DateTimeFormat;
}

/**
 * Formats a date as a relative time string based on the current date
 * for future times (e.g., "in 3 minutes", "tomorrow", "in 2 weeks", "on Feb 1, 2025").
 */
export const formatToFutureRelativeTime = (
  isoDateTime: Iso8601DateTimeFormat,
): string => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const dateObj = new Date(isoDateTime);
  const currentDate = new Date();
  const timeDiff = dateObj.getTime() - currentDate.getTime();

  // Check if it's the same calendar day
  const isSameDay =
    dateObj.getDate() === currentDate.getDate() &&
    dateObj.getMonth() === currentDate.getMonth() &&
    dateObj.getFullYear() === currentDate.getFullYear();

  if (timeDiff <= 0) {
    return "now";
  }

  // If it's the same day, show time-based relative format
  if (isSameDay) {
    const diffHours = Math.floor(timeDiff / (60 * 60 * 1000));
    const diffMinutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));

    if (diffHours === 0) {
      return `in ${diffMinutes} minutes`;
    } else {
      return `in ${diffHours} hours`;
    }
  }

  const diffDays = Math.ceil(timeDiff / ONE_DAY_MS);
  const diffWeeks = Math.ceil(diffDays / 7);

  if (diffDays === 1) {
    return "tomorrow";
  } else if (diffDays < 7) {
    return `in ${diffDays} days`;
  } else if (diffDays < 30) {
    return `in ${diffWeeks} weeks`;
  }

  // Handle future dates beyond a month
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    ...(dateObj.getFullYear() !== currentDate.getFullYear() && {
      year: "numeric",
    }),
  };
  return `on ${dateObj.toLocaleDateString(undefined, options)}`;
};

export const isNextDay = (isoTime: Iso8601DateTimeFormat) => {
  const timeDate = new Date(isoTime);
  const today = new Date();
  return (
    timeDate.getDate() !== today.getDate() ||
    timeDate.getMonth() !== today.getMonth() ||
    timeDate.getFullYear() !== today.getFullYear()
  );
};

export function getTodayOperatingHours(operatingHours: BranchOperatingHours) {
  // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const today = new Date().getDay();

  // Map the day of the week to the corresponding property names
  const dayMapping: {
    [key: number]: {
      open: keyof BranchOperatingHours;
      close: keyof BranchOperatingHours;
    };
  } = {
    0: { open: "sunday_open_time", close: "sunday_close_time" },
    1: { open: "monday_open_time", close: "monday_close_time" },
    2: { open: "tuesday_open_time", close: "tuesday_close_time" },
    3: { open: "wednesday_open_time", close: "wednesday_close_time" },
    4: { open: "thursday_open_time", close: "thursday_close_time" },
    5: { open: "friday_open_time", close: "friday_close_time" },
    6: { open: "saturday_open_time", close: "saturday_close_time" },
  };

  // Retrieve the corresponding open and close times based on the current day
  const { open, close } = dayMapping[today];

  // Function to convert time string (HH:MM:SS) to AM/PM format
  const convertToAMPM = (time: string) => {
    const date = new Date(`1970-01-01T${time}Z`); // Create a date object with the time
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Return the operating hours for today, formatted to AM/PM
  return {
    open_time: convertToAMPM(operatingHours[open] as string),
    close_time: convertToAMPM(operatingHours[close] as string),
  };
}

export function getTodayOperatingTime(operatingHours: BranchOperatingHours): {
  open: string;
  close: string;
  open_iso: Iso8601DateTimeFormat;
  close_iso: Iso8601DateTimeFormat;
} | null {
  const today = new Date();
  const currentDay = today.getDay();

  const dayMapping: Record<
    number,
    { open: keyof BranchOperatingHours; close: keyof BranchOperatingHours }
  > = {
    0: { open: "sunday_open_time", close: "sunday_close_time" },
    1: { open: "monday_open_time", close: "monday_close_time" },
    2: { open: "tuesday_open_time", close: "tuesday_close_time" },
    3: { open: "wednesday_open_time", close: "wednesday_close_time" },
    4: { open: "thursday_open_time", close: "thursday_close_time" },
    5: { open: "friday_open_time", close: "friday_close_time" },
    6: { open: "saturday_open_time", close: "saturday_close_time" },
  };

  const { open, close } = dayMapping[currentDay];

  const openTime = operatingHours[open] as string;
  const closeTime = operatingHours[close] as string;

  if (
    !openTime ||
    !closeTime ||
    (openTime === "00:00:00" && closeTime === "00:00:00")
  ) {
    return null; // Closed today
  }

  const todayISO = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const openDateTimeISO = `${todayISO}T${openTime}Z` as Iso8601DateTimeFormat;
  const closeDateTimeISO = `${todayISO}T${closeTime}Z` as Iso8601DateTimeFormat;

  // Check if current time is past closing time
  const now = new Date();
  const closingTimeToday = new Date(closeDateTimeISO);

  // If current time is past closing time, calculate next opening time
  if (now > closingTimeToday) {
    // Get next day's operating hours
    const nextDay = (currentDay + 1) % 7;
    const nextDayMapping = dayMapping[nextDay];
    const nextOpenTime = operatingHours[nextDayMapping.open] as string;
    const nextCloseTime = operatingHours[nextDayMapping.close] as string;

    if (
      !nextOpenTime ||
      !nextCloseTime ||
      (nextOpenTime === "00:00:00" && nextCloseTime === "00:00:00")
    ) {
      // If next day is closed, keep looking for the next open day
      // For now, let's just return null or handle this case
      return null;
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split("T")[0];

    const nextOpenDateTimeISO =
      `${tomorrowISO}T${nextOpenTime}Z` as Iso8601DateTimeFormat;
    const nextCloseDateTimeISO =
      `${tomorrowISO}T${nextCloseTime}Z` as Iso8601DateTimeFormat;

    const convertToAMPM = (time: string) => {
      const date = new Date(`1970-01-01T${time}Z`);
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    return {
      open: convertToAMPM(nextOpenTime),
      close: convertToAMPM(nextCloseTime),
      open_iso: nextOpenDateTimeISO,
      close_iso: nextCloseDateTimeISO,
    };
  }

  const convertToAMPM = (time: string) => {
    const date = new Date(`1970-01-01T${time}Z`);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return {
    open: convertToAMPM(openTime),
    close: convertToAMPM(closeTime),
    open_iso: openDateTimeISO,
    close_iso: closeDateTimeISO,
  };
}

export const isCurrentlyOpen = (
  operatingHours: BranchOperatingHours,
): boolean => {
  const now = new Date();
  const dayName = getDayName(now.getDay()); // e.g., 'sunday'
  const openKey = `${dayName}_open_time` as keyof BranchOperatingHours;
  const closeKey = `${dayName}_close_time` as keyof BranchOperatingHours;

  const todayISO = now.toISOString().split("T")[0]; // YYYY-MM-DD

  const open = new Date(`${todayISO}T${operatingHours[openKey]}Z`);
  const close = new Date(`${todayISO}T${operatingHours[closeKey]}Z`);

  return now >= open && now <= close;
};

// Helper function to get the day name (e.g., "monday", "tuesday")
const getDayName = (day: number): string => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[day];
};

// Function to estimate travel time based on distance (in km) and average speed (in km/h)
export const estimateTravelTime = (
  distanceInKm: number,
  averageSpeedKmH: number = 25,
): string => {
  if (distanceInKm <= 0) return "Invalid distance";

  const timeInHours = distanceInKm / averageSpeedKmH; // Time in hours
  const timeInMinutes = timeInHours * 60; // Convert to minutes

  // Calculate hours and minutes from the total time in minutes
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = Math.round(timeInMinutes % 60);

  // Return formatted time in hours and minutes
  return `${hours} hours ${minutes} minutes`;
};
