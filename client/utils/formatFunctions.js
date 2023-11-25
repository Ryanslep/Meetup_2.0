// Function to format local time as hh:mm
export const localTime = (utcTimestamp) => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return utcTimestamp ? new Date(utcTimestamp).toLocaleTimeString('en-US', options) : null;
};

// Function to format local date as MM/DD/YYYY
export const localDate = (utcTimestamp) => {
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  const formattedDate = utcTimestamp ? new Date(utcTimestamp).toLocaleDateString('en-US', options) : null;

  if (formattedDate) {
    const day = new Date(utcTimestamp).getDate();
    const daySuffix = getDaySuffix(day);
    return formattedDate.replace(/\d+/, (day) => `${day}${daySuffix}`);
  }

  return null;
};

// Add getDaySuffix function
export const getDaySuffix = (day) => {
  if (day >= 11 && day <= 13) {
    return 'th';
  }

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};
