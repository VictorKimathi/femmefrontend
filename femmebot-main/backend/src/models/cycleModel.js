const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
  lastPeriodStart: {
    type: Date,
    required: true,
  },
  periodLength: {
    type: Number,
    required: true,
  },
  cycleLength: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to calculate period days, ovulation day, and fertile window
cycleSchema.methods.calculateFertility = function() {
  const periodStart = new Date(this.lastPeriodStart);
  const periodEnd = new Date(periodStart);
  periodEnd.setDate(periodEnd.getDate() + this.periodLength - 1); // Calculate end date of the period

  const ovulationDay = new Date(this.lastPeriodStart);
  ovulationDay.setDate(ovulationDay.getDate() + this.cycleLength - 14); // Ovulation is typically 14 days before the next period

  const fertileWindowStart = new Date(ovulationDay);
  fertileWindowStart.setDate(fertileWindowStart.getDate() - 5); // Fertile window starts 5 days before ovulation

  const fertileWindowEnd = new Date(ovulationDay);
  fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1); // Fertile window ends 1 day after ovulation

  return {
    period: {
      start: periodStart,
      end: periodEnd,
    },
    ovulationDay,
    fertileWindow: {
      start: fertileWindowStart,
      end: fertileWindowEnd,
    },
  };
};

const Cycle = mongoose.model('Cycle', cycleSchema);
module.exports = Cycle;
