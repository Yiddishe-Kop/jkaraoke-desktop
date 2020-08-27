String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

Math.randomBetween = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
