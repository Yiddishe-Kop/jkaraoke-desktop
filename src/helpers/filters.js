export function timestamp(time) {
  if (!time) return '00:00';
  time = Number(time).toFixed(0);
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  var hours = Math.floor(time / 3600);
  return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
}

function str_pad_left(string, pad, length) {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}

export function dateToTime(date) {
  return new Date(date).toLocaleDateString('en-GB') + ' - ' + new Date(date).toLocaleTimeString('en-GB');
}
