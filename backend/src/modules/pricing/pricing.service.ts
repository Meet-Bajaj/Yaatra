import { Injectable, Logger } from '@nestjs/common';
import { FARE_CONSTANTS } from '../../common/constants/fare.constants';

export interface FareEstimate {
  type: 'CARPOOL' | 'PROFESSIONAL';
  distanceKm: number;
  durationMin: number;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  subtotal: number;
  commission: number;
  commissionRate: number;
  totalFare: number;
  pricePerSeat?: number;
  breakdown: string;
}

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);

  /**
   * Calculate fare estimate for a trip.
   */
  calculateFare(
    type: 'CARPOOL' | 'PROFESSIONAL',
    distanceKm: number,
    durationMin: number,
    surgeMultiplier: number = 1,
    options?: { pricePerSeat?: number; seats?: number },
  ): FareEstimate {
    if (type === 'CARPOOL') {
      return this.calculateCarpoolFare(
        distanceKm,
        durationMin,
        surgeMultiplier,
        options?.pricePerSeat,
        options?.seats || 1,
      );
    }
    return this.calculateProfessionalFare(
      distanceKm,
      durationMin,
      surgeMultiplier,
    );
  }

  /**
   * Carpool: cost-share model — ₹8/km or driver-set pricePerSeat.
   */
  private calculateCarpoolFare(
    distanceKm: number,
    durationMin: number,
    surgeMultiplier: number,
    pricePerSeat?: number,
    seats: number = 1,
  ): FareEstimate {
    // If driver set a pricePerSeat, use it; otherwise use ₹8/km base
    const perSeatFare =
      pricePerSeat || distanceKm * FARE_CONSTANTS.CARPOOL_COST_PER_KM;

    const baseFare = perSeatFare;
    const distanceFare = 0; // Included in cost-share
    const timeFare = 0; // Not charged in carpool

    const subtotal = baseFare * seats * surgeMultiplier;

    // Commission: 10–15%, capped at ₹100
    const commissionRate = FARE_CONSTANTS.CARPOOL_COMMISSION_MIN; // 10%
    const commission = Math.min(
      subtotal * commissionRate,
      FARE_CONSTANTS.CARPOOL_COMMISSION_CAP,
    );

    const totalFare = subtotal + commission;

    return {
      type: 'CARPOOL',
      distanceKm,
      durationMin,
      baseFare: Math.round(baseFare),
      distanceFare: Math.round(distanceFare),
      timeFare: Math.round(timeFare),
      surgeMultiplier,
      subtotal: Math.round(subtotal),
      commission: Math.round(commission),
      commissionRate,
      totalFare: Math.round(totalFare),
      pricePerSeat: Math.round(perSeatFare),
      breakdown: `Carpool: ₹${Math.round(perSeatFare)}/seat × ${seats} seat(s) + ₹${Math.round(commission)} commission`,
    };
  }

  /**
   * Professional: base ₹50 + ₹12/km + ₹2/min, surge capped ≤1.5x.
   */
  private calculateProfessionalFare(
    distanceKm: number,
    durationMin: number,
    surgeMultiplier: number,
  ): FareEstimate {
    // Cap surge at 1.5x
    const cappedSurge = Math.min(surgeMultiplier, FARE_CONSTANTS.PRO_SURGE_CAP);

    const baseFare = FARE_CONSTANTS.PRO_BASE_FARE;
    const distanceFare = distanceKm * FARE_CONSTANTS.PRO_COST_PER_KM;
    const timeFare = durationMin * FARE_CONSTANTS.PRO_COST_PER_MIN;

    const subtotal = (baseFare + distanceFare + timeFare) * cappedSurge;

    // Commission: 20–25%
    const commissionRate = FARE_CONSTANTS.PRO_COMMISSION_MIN; // 20%
    const commission = subtotal * commissionRate;

    const totalFare = subtotal + commission;

    return {
      type: 'PROFESSIONAL',
      distanceKm,
      durationMin,
      baseFare: Math.round(baseFare),
      distanceFare: Math.round(distanceFare),
      timeFare: Math.round(timeFare),
      surgeMultiplier: cappedSurge,
      subtotal: Math.round(subtotal),
      commission: Math.round(commission),
      commissionRate,
      totalFare: Math.round(totalFare),
      breakdown: `Professional: ₹${baseFare} base + ₹${FARE_CONSTANTS.PRO_COST_PER_KM}/km × ${distanceKm}km + ₹${FARE_CONSTANTS.PRO_COST_PER_MIN}/min × ${durationMin}min${cappedSurge > 1 ? ` × ${cappedSurge}x surge` : ''} + ₹${Math.round(commission)} commission`,
    };
  }

  /**
   * Calculate commission for a completed payment.
   */
  calculateCommission(
    type: 'CARPOOL' | 'PROFESSIONAL',
    fareTotal: number,
  ): { commission: number; driverPayout: number; commissionRate: number } {
    let commissionRate: number;
    let commissionCap: number | undefined;

    if (type === 'CARPOOL') {
      commissionRate = FARE_CONSTANTS.CARPOOL_COMMISSION_MIN;
      commissionCap = FARE_CONSTANTS.CARPOOL_COMMISSION_CAP;
    } else {
      commissionRate = FARE_CONSTANTS.PRO_COMMISSION_MIN;
      commissionCap = undefined;
    }

    let commission = fareTotal * commissionRate;
    if (commissionCap) {
      commission = Math.min(commission, commissionCap);
    }

    return {
      commission: Math.round(commission),
      driverPayout: Math.round(fareTotal - commission),
      commissionRate,
    };
  }
}
