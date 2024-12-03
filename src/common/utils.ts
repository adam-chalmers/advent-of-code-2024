const START = new Date("2024-12-01T15:00:00.000+10:00").getTime();
const MS_IN_DAY = 1000 * 60 * 60 * 24;

export const getDayNumber = () => {
  return Math.min(Math.ceil((Date.now() - START) / MS_IN_DAY), 25);
};
