// Highly Simplified logic to calc duration
function calculateDuration(fromPincode, toPincode) {
  return Math.abs(parseInt(fromPincode) - parseInt(toPincode)) % 24;
}

module.exports = calculateDuration;
