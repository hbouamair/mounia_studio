import type { CourseType, Studio } from "./types";
import { computeBookingPrice, formatMad, type PriceBreakdown } from "./pricing";
import type { PeakWindow } from "./types";

/** Studio reserved for private courses (max 3 people). */
export const PRIVATE_STUDIO_NAME = "Studio 3";

export const PRIVATE_COURSE_DISCOUNT_PERCENT = 50;

/**
 * Pack booking: normal créneau durations (1 h, 1h30, 2 h…).
 * Minimum PACK_HOURS_TRANCHE hours total; more hours allowed.
 * −20 % applies per complete 10-hour block only (pricing rule).
 */
export const REGULAR_COURSE_MIN_COUNT = 10;

/** Hours per discounted tranche (−20 % on each complete block). */
export const PACK_HOURS_TRANCHE = 10;

/** @deprecated Pack no longer forces 1 h créneaux — kept for compatibility. */
export const PACK_SLOT_DURATION_MINUTES = 60;

/** Soft cap on number of créneaux in one pack booking. */
export const PACK_SLOT_MAX_COUNT = 40;

/** Max total hours in one pack booking. */
export const PACK_MAX_HOURS = 40;

/** Flat discount applied on each complete 10-hour tranche. */
export const PACK_DISCOUNT_PERCENT = 20;

/** Minimum hours required for pack eligibility. */
export function packMinHours(): number {
  return PACK_HOURS_TRANCHE;
}

export function packMaxHours(): number {
  return PACK_MAX_HOURS;
}

/** @deprecated Any normal duration is valid; discount uses total hours. */
export function isValidPackDurationMinutes(_durationMinutes: number): boolean {
  return true;
}

/** True when total pack hours are within the allowed range. */
export function isValidPackHours(totalHours: number): boolean {
  return totalHours >= PACK_HOURS_TRANCHE && totalHours <= PACK_MAX_HOURS;
}

/**
 * @deprecated Prefer isValidPackHours(totalPackHours(...)).
 * Kept for callers that still think in slot counts at 1 h.
 */
export function isValidPackSlotCount(slotCount: number): boolean {
  return isValidPackHours(slotCount);
}

export function isPrivateStudio(studio: Pick<Studio, "name">): boolean {
  return studio.name === PRIVATE_STUDIO_NAME;
}

/** Effective hourly rates after course-type adjustment (private = −50%). */
export function getEffectiveStudioPrices(
  studio: Pick<Studio, "name" | "price_peak_mad" | "price_offpeak_mad">,
  courseType: CourseType
): Pick<Studio, "price_peak_mad" | "price_offpeak_mad"> {
  if (courseType !== "private") {
    return {
      price_peak_mad: studio.price_peak_mad,
      price_offpeak_mad: studio.price_offpeak_mad,
    };
  }
  const factor = 1 - PRIVATE_COURSE_DISCOUNT_PERCENT / 100;
  return {
    price_peak_mad: Math.round(studio.price_peak_mad * factor * 100) / 100,
    price_offpeak_mad: Math.round(studio.price_offpeak_mad * factor * 100) / 100,
  };
}

export function filterStudiosForCourseType(
  studios: Studio[],
  courseType: CourseType
): Studio[] {
  if (courseType === "private") {
    return studios.filter(isPrivateStudio);
  }
  return studios;
}

/** @deprecated Pack no longer includes free sessions — always 0. */
export function getFreeCoursesForPackage(_courseCount: number): number {
  return 0;
}

/** All sessions in a pack are billed (discount is % off, not free slots). */
export function getPaidCoursesForPackage(courseCount: number): number {
  return courseCount;
}

/** @deprecated Prefer isPackHoursEligible(totalHours). */
export function isPackCourseCount(courseCount: number): boolean {
  return courseCount >= REGULAR_COURSE_MIN_COUNT;
}

/** True when total hours reach at least one 10-hour discount block. */
export function isPackHoursEligible(totalHours: number): boolean {
  return totalHours >= PACK_HOURS_TRANCHE;
}

export function totalPackHours(
  slotCount: number,
  durationMinutes: number
): number {
  return Math.round(((slotCount * durationMinutes) / 60) * 100) / 100;
}

/**
 * Complete 10-hour blocks that get −20 %.
 * e.g. 10→10, 11→10, 12→10, 20→20, 21→20
 */
export function discountedPackHours(totalHours: number): number {
  if (totalHours <= 0) return 0;
  return Math.floor(totalHours / PACK_HOURS_TRANCHE) * PACK_HOURS_TRANCHE;
}

export function packDiscountMad(subtotalMad: number): number {
  return Math.round(subtotalMad * (PACK_DISCOUNT_PERCENT / 100) * 100) / 100;
}

/**
 * −20 % only on the share of value covered by complete 10-hour tranches.
 * Remaining hours stay at full rate.
 */
export function packTrancheDiscountMad(
  subtotalMad: number,
  totalHours: number
): number {
  const discountedHours = discountedPackHours(totalHours);
  if (discountedHours <= 0 || totalHours <= 0 || subtotalMad <= 0) return 0;
  const discountedShare = Math.min(1, discountedHours / totalHours);
  return (
    Math.round(
      subtotalMad * discountedShare * (PACK_DISCOUNT_PERCENT / 100) * 100
    ) / 100
  );
}

export function packHoursOfferTitle(): string {
  return `Pack ${PACK_HOURS_TRANCHE} heures — ${PACK_DISCOUNT_PERCENT} % d'économie`;
}

export function packHoursOfferDescription(): string {
  return `Bénéficiez de −${PACK_DISCOUNT_PERCENT} % sur chaque tranche de ${PACK_HOURS_TRANCHE} heures réservées (durée libre par créneau).`;
}

export function packHoursOfferConditions(): string {
  return `La remise de ${PACK_DISCOUNT_PERCENT} % s’applique par bloc de ${PACK_HOURS_TRANCHE} heures cumulées. Ex. : 10 h → −${PACK_DISCOUNT_PERCENT} % sur 10 h · 11 h → −${PACK_DISCOUNT_PERCENT} % sur 10 h + 1 h au tarif normal · 20 h → −${PACK_DISCOUNT_PERCENT} % sur 20 h · 21 h → −${PACK_DISCOUNT_PERCENT} % sur 20 h + 1 h au tarif normal. Minimum ${PACK_HOURS_TRANCHE} h au total (créneaux 1 h, 1h30, 2 h…).`;
}

/** @deprecated Prefer packHoursOfferTitle() */
export function regularCourseOfferLabel(): string {
  return packHoursOfferTitle();
}

export interface BookingDiscountBreakdown {
  basePrice: PriceBreakdown;
  /** Price of one session (same slot & duration). */
  sessionPriceMad: number;
  /** Number of courses billed (1 = single booking, no forfait). */
  packageCourseCount: number;
  /** sessionPrice × packageCourseCount, before pack %. */
  packageSubtotalMad: number;
  courseTypeDiscountMad: number;
  /** Always 0 — kept for UI/API compatibility. */
  freeCoursesIncluded: number;
  /** Pack −20% on complete 10h tranches (or 0 for single bookings). */
  regularCourseDiscountMad: number;
  totalBeforePromoMad: number;
  totalHours: number;
  discountedHours: number;
  fullPriceHours: number;
}

export function computeBookingPriceWithDiscounts(options: {
  studio: Studio;
  courseType: CourseType;
  date: string;
  startMinutes: number;
  durationMinutes: number;
  peakWindows: PeakWindow[];
  regularCourseCount?: number;
}): BookingDiscountBreakdown {
  const effective = getEffectiveStudioPrices(options.studio, options.courseType);
  const basePrice = computeBookingPrice(
    effective,
    options.date,
    options.startMinutes,
    options.durationMinutes,
    options.peakWindows
  );

  const sessionPriceMad = basePrice.totalMad;
  let courseTypeDiscountMad = 0;

  if (options.courseType === "private") {
    const fullPrice = computeBookingPrice(
      options.studio,
      options.date,
      options.startMinutes,
      options.durationMinutes,
      options.peakWindows
    );
    courseTypeDiscountMad =
      Math.round((fullPrice.totalMad - sessionPriceMad) * 100) / 100;
  }

  const hasPackage =
    options.regularCourseCount != null && options.regularCourseCount >= 1;
  const packageCourseCount = hasPackage ? options.regularCourseCount! : 1;

  const packageSubtotalMad =
    Math.round(sessionPriceMad * packageCourseCount * 100) / 100;

  const totalHours = totalPackHours(
    packageCourseCount,
    options.durationMinutes
  );
  const applyPackDiscount =
    hasPackage && isPackHoursEligible(totalHours);
  const discountedHours = applyPackDiscount
    ? discountedPackHours(totalHours)
    : 0;
  const fullPriceHours =
    Math.round((totalHours - discountedHours) * 100) / 100;

  const freeCoursesIncluded = 0;
  const regularCourseDiscountMad = applyPackDiscount
    ? packTrancheDiscountMad(packageSubtotalMad, totalHours)
    : 0;

  const totalBeforePromoMad = Math.max(
    0,
    Math.round((packageSubtotalMad - regularCourseDiscountMad) * 100) / 100
  );

  return {
    basePrice,
    sessionPriceMad,
    packageCourseCount,
    packageSubtotalMad,
    courseTypeDiscountMad: hasPackage
      ? Math.round(courseTypeDiscountMad * packageCourseCount * 100) / 100
      : courseTypeDiscountMad,
    freeCoursesIncluded,
    regularCourseDiscountMad,
    totalBeforePromoMad,
    totalHours,
    discountedHours,
    fullPriceHours,
  };
}

/** One-line package summary for receipts and confirmation. */
export function formatPackageSummary(b: BookingDiscountBreakdown): string | null {
  if (b.packageCourseCount <= 1) return null;
  if (b.regularCourseDiscountMad > 0) {
    return `${b.totalHours} h · −${PACK_DISCOUNT_PERCENT} % sur ${b.discountedHours} h · ${formatMad(b.totalBeforePromoMad)}`;
  }
  return `${b.packageCourseCount} créneaux × ${formatMad(b.sessionPriceMad)} = ${formatMad(b.packageSubtotalMad)}`;
}

export interface BookingSlotInput {
  date: string;
  startMinutes: number;
}

export interface SlotQuote {
  date: string;
  startMinutes: number;
  sessionPriceMad: number;
  chargedPriceMad: number;
  /** Minutes of this slot covered by a discounted 10h tranche. */
  discountedMinutes: number;
  /** Always false with % pack discount — kept for compatibility. */
  isFree: boolean;
  courseTypeDiscountMad: number;
}

export interface MultiSlotPackageBreakdown {
  slots: SlotQuote[];
  packageCourseCount: number;
  packageSubtotalMad: number;
  freeCoursesIncluded: number;
  regularCourseDiscountMad: number;
  courseTypeDiscountMad: number;
  totalBeforePromoMad: number;
  totalHours: number;
  discountedHours: number;
  fullPriceHours: number;
}

/**
 * Price N distinct slots as a package.
 * −20 % applies only to complete cumulative 10-hour tranches;
 * leftover hours are billed at the regular rate.
 */
export function computeMultiSlotPackagePrice(options: {
  studio: Studio;
  courseType: CourseType;
  slots: BookingSlotInput[];
  durationMinutes: number;
  peakWindows: PeakWindow[];
}): MultiSlotPackageBreakdown {
  const { studio, courseType, slots, durationMinutes, peakWindows } = options;
  const packageCourseCount = slots.length;
  const totalHours = totalPackHours(packageCourseCount, durationMinutes);
  const applyPackDiscount = isPackHoursEligible(totalHours);
  const discountedHours = applyPackDiscount
    ? discountedPackHours(totalHours)
    : 0;
  const fullPriceHours =
    Math.round((totalHours - discountedHours) * 100) / 100;
  let remainingDiscountedMinutes = discountedHours * 60;

  const slotQuotes: SlotQuote[] = slots.map((slot) => {
    const single = computeBookingPriceWithDiscounts({
      studio,
      courseType,
      date: slot.date,
      startMinutes: slot.startMinutes,
      durationMinutes,
      peakWindows,
      regularCourseCount: 1,
    });
    const sessionPriceMad = single.sessionPriceMad;
    const discountedMinutes = applyPackDiscount
      ? Math.min(durationMinutes, remainingDiscountedMinutes)
      : 0;
    remainingDiscountedMinutes -= discountedMinutes;
    const fullMinutes = durationMinutes - discountedMinutes;
    const discShare = durationMinutes > 0 ? discountedMinutes / durationMinutes : 0;
    const fullShare = durationMinutes > 0 ? fullMinutes / durationMinutes : 0;
    const chargedPriceMad =
      Math.round(
        (sessionPriceMad * discShare * (1 - PACK_DISCOUNT_PERCENT / 100) +
          sessionPriceMad * fullShare) *
          100
      ) / 100;

    return {
      date: slot.date,
      startMinutes: slot.startMinutes,
      sessionPriceMad,
      courseTypeDiscountMad: single.courseTypeDiscountMad,
      isFree: false,
      discountedMinutes,
      chargedPriceMad,
    };
  });

  const packageSubtotalMad =
    Math.round(
      slotQuotes.reduce((sum, s) => sum + s.sessionPriceMad, 0) * 100
    ) / 100;
  const chargedTotalMad =
    Math.round(
      slotQuotes.reduce((sum, s) => sum + s.chargedPriceMad, 0) * 100
    ) / 100;
  const regularCourseDiscountMad =
    Math.round((packageSubtotalMad - chargedTotalMad) * 100) / 100;
  const courseTypeDiscountMad =
    Math.round(
      slotQuotes.reduce((sum, s) => sum + s.courseTypeDiscountMad, 0) * 100
    ) / 100;
  const totalBeforePromoMad = chargedTotalMad;

  return {
    slots: slotQuotes,
    packageCourseCount,
    packageSubtotalMad,
    freeCoursesIncluded: 0,
    regularCourseDiscountMad,
    courseTypeDiscountMad,
    totalBeforePromoMad,
    totalHours,
    discountedHours,
    fullPriceHours,
  };
}

/** Distribute a final package total across charged slots (proportional). */
export function allocatePackageTotals(
  chargedPrices: number[],
  finalTotalMad: number
): number[] {
  const sum = chargedPrices.reduce((a, b) => a + b, 0);
  if (sum <= 0 || chargedPrices.length === 0) {
    return chargedPrices.map(() => 0);
  }
  const allocated = chargedPrices.map(
    (p) => Math.round(((p / sum) * finalTotalMad) * 100) / 100
  );
  // Fix rounding drift on the last non-zero slot
  const drift =
    Math.round((finalTotalMad - allocated.reduce((a, b) => a + b, 0)) * 100) /
    100;
  if (drift !== 0) {
    for (let i = allocated.length - 1; i >= 0; i--) {
      if (chargedPrices[i] > 0 || i === 0) {
        allocated[i] = Math.round((allocated[i] + drift) * 100) / 100;
        break;
      }
    }
  }
  return allocated;
}
