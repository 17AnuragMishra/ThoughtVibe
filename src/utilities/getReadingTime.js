
const AVQ_READ_WPM = 200
const getReadingTime = (text) =>
  Math.ceil(text.split(" ").length / AVQ_READ_WPM);

module.exports = getReadingTime;