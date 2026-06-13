export { haversineKm as haversineDistance } from './haversine';

const PREP_TIME_MINS = 15;
const AVG_SPEED_KMPH = 20;

/** Returns ETA in minutes, rounded to nearest 5 */
export function calculateETA(distanceKm: number): number {
  const travelMins = (distanceKm / AVG_SPEED_KMPH) * 60;
  return Math.max(20, Math.round((PREP_TIME_MINS + travelMins) / 5) * 5);
}
