/**
 * Returns parser function which converts a value to a string.
 */
export function stringTrimParser() {
  return (value: any) => {
    try {
      return value.toString().trim();
    } catch (e) {
      return null;
    }
  };
}
