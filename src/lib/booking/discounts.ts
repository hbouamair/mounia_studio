import type { CourseType, Studio } from "./types";
import { computeBookingPrice, formatMad, type PriceBreakdown } from "./pricing";
import type { PeakWindow } from "./types";

/** Studio reserved for private courses (max 3 people). */
export const PRIVATE_STUDIO_NAME = "Studio 3";

export const PRIVATE_COURSE_DISCOUNT_PERCENT = 50;
/** Minimum courses in a package (pack 10). */
export const REGULAR_COURSE_MIN_COUNT = 10;
/** Flat discount applied to pack-10 bookings. */
export const PACK_DISCOUNT_PERCENT = 20;

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

export function isPackCourseCount(courseCount: number): boolean {
  return courseCount >= REGULAR_COURSE_MIN_COUNT;
}

export function packDiscountMad(subtotalMad: number): number {
  return Math.round(subtotalMad * (PACK_DISCOUNT_PERCENT / 100) * 100) / 100;
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
  /** Pack −20% amount (or 0 for single bookings). */
  regularCourseDiscountMad: number;
  totalBeforePromoMad: number;
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

  const freeCoursesIncluded = 0;
  const regularCourseDiscountMad =
    hasPackage && isPackCourseCount(packageCourseCount)
      ? packDiscountMad(packageSubtotalMad)
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
  };
}

/** Short label for the pack-10 offer (UI). */
export function regularCourseOfferLabel(): string {
  return `Pack ${REGULAR_COURSE_MIN_COUNT} locations : −${PACK_DISCOUNT_PERCENT} %`;
}

/** One-line package summary for receipts and confirmation. */
export function formatPackageSummary(b: BookingDiscountBreakdown): string | null {
  if (b.packageCourseCount <= 1) return null;
  if (b.regularCourseDiscountMad > 0) {
    return `${b.packageCourseCount} locations · −${PACK_DISCOUNT_PERCENT} % · ${formatMad(b.totalBeforePromoMad)}`;
  }
  return `${b.packageCourseCount} cours × ${formatMad(b.sessionPriceMad)} = ${formatMad(b.packageSubtotalMad)}`;
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
}

/**
 * Price N distinct slots as a package.
 * Pack of 10+ applies a flat −20% on the package subtotal.
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
  const applyPackDiscount = isPackCourseCount(packageCourseCount);
  const chargeFactor = applyPackDiscount
    ? 1 - PACK_DISCOUNT_PERCENT / 100
    : 1;

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
    return {
      date: slot.date,
      startMinutes: slot.startMinutes,
      sessionPriceMad,
      courseTypeDiscountMad: single.courseTypeDiscountMad,
      isFree: false,
      chargedPriceMad:
        Math.round(sessionPriceMad * chargeFactor * 100) / 100,
    };
  });

  const packageSubtotalMad =
    Math.round(
      slotQuotes.reduce((sum, s) => sum + s.sessionPriceMad, 0) * 100
    ) / 100;
  const regularCourseDiscountMad = applyPackDiscount
    ? packDiscountMad(packageSubtotalMad)
    : 0;
  const courseTypeDiscountMad =
    Math.round(
      slotQuotes.reduce((sum, s) => sum + s.courseTypeDiscountMad, 0) * 100
    ) / 100;
  const totalBeforePromoMad =
    Math.round((packageSubtotalMad - regularCourseDiscountMad) * 100) / 100;

  return {
    slots: slotQuotes,
    packageCourseCount,
    packageSubtotalMad,
    freeCoursesIncluded: 0,
    regularCourseDiscountMad,
    courseTypeDiscountMad,
    totalBeforePromoMad,
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
