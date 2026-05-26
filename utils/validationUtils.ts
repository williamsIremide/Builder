export const iso8601Regex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?$/;
export const tagRegex = /^[a-zA-Z0-9._]+$/;
export const phoneNumberRegex =
  /^(\+?\d{1,4}[\s-])?(\(?\d{1,4}\)?[\s-])?[\d\s-]{6,20}$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const decimalStringRegex = /^\d*(\.\d{0,2})?$/; // Format of Python's Decimal instance

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return phoneNumberRegex.test(phoneNumber);
};
