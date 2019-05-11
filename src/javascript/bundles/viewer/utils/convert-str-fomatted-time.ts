export function  convertStrFormattedTime(str: string, ms: boolean = false) {
  const decimalPart = str.split('.')[1];
  const split = str.split('.')[0].split(':');
  const hours = parseInt(split[0], 10) * 60 * 60;
  const minutes = parseInt(split[1], 10) * 60;
  const seconds = parseInt(split[2], 10);

  const time = +(`${hours + minutes + seconds}.${decimalPart}`);

  return ms ? time * 1000 : time;
}