export function toHtmlNewlines(text: string, breaks = '<br/>') {
  if (!text) {
    return '';
  }

  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(\r?\n)|↵/g, breaks);
}

export function shortHash(val: string) {
  if (!val || val.length <= 10) {
    return val;
  }
  return `${val.slice(0, 6)}...${val.slice(-4)}`;
}

export function removeLastSlash(val: string) {
  return val.replace(/\/$/, '');
}

export function zeroPad(num: string | number, size = 2) {
  let nums = num.toString();
  while (nums.length < size) {
    nums = '0' + num;
  }
  return nums;
}

export function isLowercaseEqual(str1: string, str2: string) {
  if (!str1 || typeof str1 !== 'string') {
    str1 = '';
  }

  if (!str2 || typeof str2 !== 'string') {
    str2 = '';
  }

  return str1.toLowerCase() === str2.toLowerCase();
}

/**
 * Return values separated by dash. If values are same, return only one value
 */
export function getOneOrRange(val1: number | string, val2: number | string) {
  if (val1 === val2) {
    return val1;
  }
  return val1 + '-' + val2;
}

export function getFormattedPrice(
  val = 0,
  moreOptions?: Intl.NumberFormatOptions,
  locale = 'en-US'
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
    ...moreOptions,
  });

  return formatter.format(val).slice(4);
}

/**
 * To fixed and back to number to remove decimal when 0. eg 10.00 -> 10
 */
export function getFixed(num: number | string, places = 2, round = false, roundToDecimals = false) {
  if (!num) {
    num = 0;
  }

  if (typeof num !== 'number') {
    num = parseFloat(num);
  }

  if (roundToDecimals) {
    num = Math.floor(num * 10 * Math.pow(10, places)) / (10 * Math.pow(10, places));
  } else if (round) {
    return Math.round(num);
  }

  if (!places) {
    places = 0;
  }

  return parseFloat(num.toFixed(places));
}

export function getCompactValue(value: number | string, decimals = 2) {
  if (typeof value === 'string') {
    value = +value;
  }

  if (isNaN(value)) {
    return value;
  }

  if (value > 1000000) {
    return `${getFixed(value / 1000000, 3, false, true)}M`;
  } else if (value > 10000) {
    return `${getFixed(value / 1000, 2, false, true)}K`;
  }

  return `${getFixed(value, decimals)}`;
}
