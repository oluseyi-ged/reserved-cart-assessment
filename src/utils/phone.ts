/**
 * Nigerian Phone Number Utilities
 * Validates and formats Nigerian mobile numbers to +234 format
 */

// Nigerian mobile number prefixes by telco
// MTN: 0703, 0706, 0803, 0806, 0810, 0813, 0814, 0816, 0903, 0906, 0913, 0916
// Airtel: 0701, 0708, 0802, 0808, 0812, 0901, 0902, 0904, 0907, 0912
// Glo: 0705, 0805, 0807, 0811, 0815, 0905, 0915
// 9mobile: 0809, 0817, 0818, 0908, 0909
export const NIGERIAN_PREFIXES = [
  // MTN
  '0703',
  '0706',
  '0803',
  '0806',
  '0810',
  '0813',
  '0814',
  '0816',
  '0903',
  '0906',
  '0913',
  '0916',
  // Airtel
  '0701',
  '0708',
  '0802',
  '0808',
  '0812',
  '0901',
  '0902',
  '0904',
  '0907',
  '0912',
  // Glo
  '0705',
  '0805',
  '0807',
  '0811',
  '0815',
  '0905',
  '0915',
  // 9mobile
  '0809',
  '0817',
  '0818',
  '0908',
  '0909',
];

/**
 * Normalizes a phone number by removing spaces, dashes, and other formatting
 */
export const normalizePhoneNumber = (phone: string): string => {
  return phone.replace(/[\s\-\(\)\.]/g, '');
};

/**
 * Checks if a phone number is a valid Nigerian mobile number and formats it
 * Returns null if invalid, or the formatted +234 number if valid
 */
export const formatNigerianNumber = (phone: string): string | null => {
  const normalized = normalizePhoneNumber(phone);

  // Already has +234 prefix
  if (normalized.startsWith('+234')) {
    const localPart = normalized.slice(4); // Remove +234
    // Check if it's a valid 10-digit number (without leading 0)
    if (localPart.length === 10 && /^\d+$/.test(localPart)) {
      // Validate prefix (add 0 back to check against known prefixes)
      const withZero = '0' + localPart;
      const prefix = withZero.slice(0, 4);
      if (NIGERIAN_PREFIXES.includes(prefix)) {
        return normalized;
      }
    }
    return null;
  }

  // Has 234 without + (e.g., 2348136292202)
  if (normalized.startsWith('234') && normalized.length === 13) {
    const localPart = normalized.slice(3);
    const withZero = '0' + localPart;
    const prefix = withZero.slice(0, 4);
    if (NIGERIAN_PREFIXES.includes(prefix)) {
      return '+' + normalized;
    }
    return null;
  }

  // Has a different country code (starts with + but not +234)
  if (normalized.startsWith('+')) {
    return null;
  }

  // Local format starting with 0 (e.g., 08136292202)
  if (normalized.startsWith('0') && normalized.length === 11) {
    const prefix = normalized.slice(0, 4);
    if (NIGERIAN_PREFIXES.includes(prefix)) {
      // Remove leading 0 and add +234
      return '+234' + normalized.slice(1);
    }
    return null;
  }

  // 10 digits without leading 0 (e.g., 8136292202)
  if (normalized.length === 10 && /^\d+$/.test(normalized)) {
    const withZero = '0' + normalized;
    const prefix = withZero.slice(0, 4);
    if (NIGERIAN_PREFIXES.includes(prefix)) {
      return '+234' + normalized;
    }
    return null;
  }

  return null;
};

/**
 * Checks if a phone number is a valid Nigerian mobile number
 */
export const isValidNigerianNumber = (phone: string): boolean => {
  return formatNigerianNumber(phone) !== null;
};
