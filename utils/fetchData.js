const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const fetchProducts = async (page = 1, limit = 8000) => {
  try {
    console.log("fetching products");

    const response = await fetch(
      `${BACKEND_URI}/api/products?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed`);
    }
    const data = await response.json();
    console.log("fetched data");

    return data;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    throw error;
  }
};
