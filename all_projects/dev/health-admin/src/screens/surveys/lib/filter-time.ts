export const filterPassedTime = (timePickerInterval: Date) => {
  const currentDate = new Date();
  return currentDate.getTime() < timePickerInterval.getTime();
};

export const validateFutureDate = (value: string) => {
  const selectedDate = new Date(value);
  const currentDate = new Date();

  if (selectedDate <= currentDate) {
    return "Please select a future date time.";
  }

  return true; // Validation passed
};