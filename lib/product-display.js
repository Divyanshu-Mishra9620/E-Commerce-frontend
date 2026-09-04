export const RUPEE_SYMBOL = "\u20B9";

export function sanitizeProductImage(image, fallback = "/images/lamp.jpg") {
  if (!image) return fallback;

  if (Array.isArray(image)) {
    return sanitizeProductImage(image[0], fallback);
  }

  const cleaned = String(image).replace(/[\[\]\s"]/g, "");
  return cleaned || fallback;
}

export function getNumericPrice(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(getNumericPrice(value));
}

export function getDiscountPercent(product) {
  const retailPrice = getNumericPrice(product?.retail_price);
  const discountedPrice = getNumericPrice(product?.discounted_price);

  if (!retailPrice || !discountedPrice || retailPrice <= discountedPrice) {
    return 0;
  }

  return Math.round(((retailPrice - discountedPrice) / retailPrice) * 100);
}

export function getDisplayPrices(product, fallbackRetailOffset = 200) {
  const salePrice = getNumericPrice(product?.discounted_price);
  const retailPrice = getNumericPrice(product?.retail_price);

  return {
    salePrice,
    originalPrice:
      retailPrice > salePrice
        ? retailPrice
        : salePrice > 0
          ? salePrice + fallbackRetailOffset
          : 0,
  };
}

export function getReviewSummary(product) {
  const reviews = product?.reviews;

  if (Array.isArray(reviews)) {
    if (!reviews.length) {
      return { rating: 0, count: 0 };
    }

    const ratingTotal = reviews.reduce(
      (sum, review) => sum + getNumericPrice(review?.rating),
      0
    );

    return {
      rating: ratingTotal / reviews.length,
      count: reviews.length,
    };
  }

  if (reviews && typeof reviews === "object") {
    return {
      rating: getNumericPrice(reviews.rating ?? reviews.avgRating),
      count: getNumericPrice(reviews.count ?? reviews.length),
    };
  }

  if (typeof reviews === "number") {
    return {
      rating: 0,
      count: reviews,
    };
  }

  return { rating: 0, count: 0 };
}
