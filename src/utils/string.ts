export function toUpperCaseFirstLetter(val: string) {
  return val[0].toUpperCase() + val.substr(1, val.length - 1);
}

export const formatter: any = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function isObjectEmpty(obj) {
  return Object?.keys(obj)?.length === 0;
}

export function capitalizeFirstLetter(word) {
  // Check if the input is not an empty string
  if (word.length === 0) {
    return '';
  }

  // Capitalize the first letter and convert the rest to lowercase
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const maskWord = input => {
  if (typeof input !== 'string') {
    return input;
  }

  // Replace all characters except the last 4 with 'X'
  const masked = input?.slice(0, -4)?.replace(/./g, 'X') + input?.slice(-4);

  // Add spaces after every 4 'X's
  const formatted = masked?.replace(new RegExp(`.{${4}}`, 'g'), '$& ');

  return formatted;
};

export function convertToInternationalFormat(localNumber) {
  // Check if the input follows the expected local format
  if (/^0[789]\d{9}$/.test(localNumber)) {
    // Replace the leading '0' with '234'
    return '234' + localNumber?.substring(1);
  } else {
    return 'Invalid input format';
  }
}

export function convertToLocalFormat(internationalNumber) {
  // Check if the input follows the expected international format
  if (/^234[789]\d{9}$/.test(internationalNumber)) {
    // Replace '234' with '0'
    return '0' + internationalNumber?.substring(3);
  } else {
    return 'Invalid input format';
  }
}

export function formatNumberWithCommas(input) {
  if (input === null) {
    return '0.00';
  }

  // Convert to a string with two decimal places and add commas
  return input?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function generateLocationCode(locationName) {
  // Use optional chaining to handle possible null or undefined values
  const firstWord = locationName?.split(' ')[0] || '';
  const words = firstWord?.split(' ');
  let code = '';

  // Iterate through each word in the location name
  for (const word of words) {
    // Take the first three characters of each word and convert to uppercase
    code += word?.slice(0, 3)?.toUpperCase();
  }

  return code;
}

export function combineNumbers(arr) {
  // Check if the array contains a period
  if (arr.includes('.')) {
    // If the array contains a period, combine the elements into a string
    let combinedString = arr.join('');

    // Convert the combined string to a float to handle the decimal
    let combinedNumber = parseFloat(combinedString);

    return combinedNumber;
  } else {
    // If there's no period, join and convert to an integer
    let combinedString = arr.join('');
    let combinedNumber = parseInt(combinedString);

    return combinedNumber;
  }
}

export function transformRates(ratesObject) {
  const result: any = [];

  for (const key in ratesObject) {
    if (ratesObject.hasOwnProperty(key) && key.length === 6) {
      const currencyPair = key;
      const rate = ratesObject[key];

      // Split the currencyPair into origin and base currencies
      const origin = currencyPair.substring(0, 3);
      const base = currencyPair.substring(3);

      // Create a new object with origin, base, and rate
      const transformedRate = {
        origin,
        base,
        rate,
      };

      // Push the new object into the result array
      result.push(transformedRate);
    }
  }

  return result;
}

export function isURL(str) {
  const pattern =
    /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([\w\-\._~:/?#[\]@!$&'()*+,;=]*)?$/;
  return pattern?.test(str);
}

export const calculatePercentages = data => {
  return data.map(entry => {
    const moneyIn = parseFloat(entry.money_in.replace(/[^0-9.-]+/g, ''));
    const moneyOut = parseFloat(entry.money_out.replace(/[^0-9.-]+/g, ''));
    const difference = parseFloat(entry.difference.replace(/[^0-9.-]+/g, ''));

    return {
      money_in: entry.money_in,
      money_out: entry.money_out,
      difference: entry.difference,
      money_out_percentage: ((moneyOut / moneyIn) * 100).toFixed(2) + '%',
      difference_percentage: ((difference / moneyIn) * 100).toFixed(2) + '%',
    };
  });
};
