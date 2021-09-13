import moment from "moment";

const getFile = (link, isVideo = false) => {
  const staticURL = process.env.REACT_APP_STATIC_FILE_URI;
  if (isVideo) return `${staticURL}${link}`;
  return `${staticURL}/upload${link}`;
}
const toDisplayNumber = (amount) => {
  var parts = amount.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

const parseFromBNString = (valueString, decimals = 18) => {
  if (!valueString) return 0;
  const valueLength = valueString.length;
  while (valueString.length < decimals)
      valueString = "0" + valueString;
  return parseFloat(valueString.substring(0, valueLength - decimals) + "." + valueString.substring(valueLength - decimals, valueLength));
}

const displayFromBNString = (valueString, decimals = 18) => {
  if (!valueString || valueString === "0") return "0";
  const valueLength = valueString.length;
  if (valueString.length === decimals) {
    return toDisplayNumber(parseFloat("0." + valueString));
  }
  while (valueString.length < decimals)
      valueString = "0" + valueString;
  return toDisplayNumber(parseFloat(valueString.substring(0, valueLength - decimals) + "." + valueString.substring(valueLength - decimals, valueLength)));
}

const unixTimeToTime = (unixTime, format = "YYYY-MM-DD HH:MM:ss") => {
  return moment.unix(+unixTime).format(format);
}

const UTCTimeToTime = (UTC, format = "YYYY-MM-DD HH:MM:ss") => {
  return moment(UTC).format(format);
}

const displayAddress = (address, display1 = 5, display2 = 4) => {
  if (!address || !address.length) return '';
  return address.substring(0, display1)+'...'+address.substring(address.length - display2, address.length)
}
export { toDisplayNumber, displayFromBNString, parseFromBNString, unixTimeToTime, getFile, displayAddress, UTCTimeToTime };