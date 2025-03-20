const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const fetchAllData = async () => {
  try {
    const response = await fetch(`${BACKEND_URI}/api/products`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      console.log("Fetched products:", data);
      return { products: data };
    } else if (data?.products && Array.isArray(data.products)) {
      console.log("Fetched products:", data.products);
      return { products: data.products };
    } else {
      console.error("❌ Invalid API Response:", data);
      return { products: [] };
    }
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return { products: [] };
  }
};
