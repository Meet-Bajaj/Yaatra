export const FARE_CONSTANTS = {
  // Carpool
  CARPOOL_COST_PER_KM: 8, // ₹8/km base
  CARPOOL_COMMISSION_MIN: 0.1, // 10%
  CARPOOL_COMMISSION_MAX: 0.15, // 15%
  CARPOOL_COMMISSION_CAP: 100, // ₹100 max commission

  // Professional
  PRO_BASE_FARE: 50, // ₹50 base
  PRO_COST_PER_KM: 12, // ₹12/km
  PRO_COST_PER_MIN: 2, // ₹2/min
  PRO_SURGE_CAP: 1.5, // Max 1.5x surge
  PRO_COMMISSION_MIN: 0.2, // 20%
  PRO_COMMISSION_MAX: 0.25, // 25%

  // Matching
  MAX_ROUTE_DETOUR_KM: 5,
  MAX_PICKUPS_PER_TRIP: 2,
  MATCH_RADIUS_KM: 10,
  SCHEDULED_MATCH_RADIUS_KM: 3,
} as const;
