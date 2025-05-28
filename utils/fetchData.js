const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const fetchAllData = async () => {
  try {
    const response = await fetch(`${BACKEND_URI}/api/products`);

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return { products: data };
    } else if (data?.products && Array.isArray(data.products)) {
      return { products: data.products };
    } else {
      console.error("❌❌❌❌❌❌❌❌ Invalid Response:", data);
      return { products: [] };
    }
  } catch (error) {
    console.error("❌❌❌❌❌ Error fetching products:", error);
    return { products: [] };
  }
};
