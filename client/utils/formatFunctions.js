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
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  };

  return utcTimestamp ? new Date(utcTimestamp).toLocaleDateString('en-US', options) : null;
};
