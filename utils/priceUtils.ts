import { StoreBranchItem } from "~/constants/types/models/item";
import { ValueType } from "~/constants/types/utilTypes";
import countries from "./data/countries";

export const toScaledInt = (val: string | number, scale = 100): number => {
  const num = typeof val === "string" ? Number(val.trim()) : val;

  if (!Number.isFinite(num)) {
    throw new Error("Invalid number");
  }

  return Math.round(num * scale);
};

export function formatDecimalWithCommas(decimal: string | number): string {
  if (decimal == null || decimal === "") return "0.00";

  // Convert to a string and ensure it has two decimal places
  const decimalString = Number(decimal).toFixed(2);

  // Split the integer and fractional parts
  const [integerPart, fractionalPart] = decimalString.split(".");

  // Add commas to the integer part
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );

  // Combine the formatted integer part with the fractional part
  return `${formattedIntegerPart}.${fractionalPart}`;
}

export const formatPrice = (
  value: string | number,
  currencySymbol = "₦",
  currencyCode = "NGN",
  includeCode = true,
): string => {
  if (!value || isNaN(Number(value))) return "";

  // Use formatDecimalWithCommas for robust decimal formatting
  const formattedValue = formatDecimalWithCommas(value);

  return (
    `${currencySymbol}${formattedValue}` +
    (includeCode ? ` ${currencyCode}` : "")
  );
};

/**
 * Formats a value based on its type (percentage or flat).
 *
 * @param value - The numerical value to be formatted.
 * @param valueType - The type of the value ("PERCENTAGE" or "FLAT").
 * @param currencySymbol - The symbol for the currency (default: "₦").
 * @param currencyCode - The currency code (default: "NGN").
 * @param includeCode - Whether to include the currency code in the formatted value (default: true).
 * @returns A string representation of the formatted value.
 */
export function formatValueByType(
  value: string | number,
  valueType: ValueType,
  currencySymbol = "₦",
  currencyCode = "NGN",
  includeCode = true,
): string {
  if (valueType === ValueType.PERCENTAGE) {
    return `${value}%`;
  } else {
    return formatPrice(value, currencySymbol, currencyCode, includeCode);
  }
}

export function hasDiscount(product: StoreBranchItem): boolean {
  const discountBp = Number(product.discount_percentage);
  const original = Number(product.original_price);

  if (!Number.isFinite(discountBp) || !Number.isFinite(original)) {
    return false;
  }

  return discountBp > 0 && discountBp < 10000;
}

export const getCurrencyInfo = (
  countryName?: string,
): {
  code: string;
  symbol: string;
} => {
  if (!countryName) return { code: "NGN", symbol: "₦" };
  const country = countries.find(
    (c) => c.name.common.toLowerCase() === countryName.toLowerCase(),
  );

  if (!country || !country.currencies) {
    return { code: "NGN", symbol: "₦" };
  }

  const [currencyCode, currencyDetails] = Object.entries(country.currencies)[0];
  return {
    code: currencyCode,
    symbol: currencyDetails.symbol,
  };
};
