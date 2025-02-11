// src/services/fertilityService.js
const scheduleNotification = require('../utils/notificationScheduler');

const trackFertility = async (lastPeriodDate, cycleLength) => {
  const fertileDates = calculateFertilityDates(lastPeriodDate, cycleLength);
  await scheduleNotification(fertileDates);
  return fertileDates;
};

module.exports = { trackFertility };
