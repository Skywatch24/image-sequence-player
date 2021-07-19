const convertSecondToTime = (seconds, framerate) => {
  let convertString = new Date((seconds * 1000) / framerate)
    .toISOString()
    .substr(11, 8);
  if (convertString.substr(0, 2) === "00") {
    return convertString.substr(3, 5);
  }
  return convertString;
};

module.exports = {
  convertSecondToTime
};
