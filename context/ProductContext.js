import { createContext, useState, useEffect } from "react";
import { fetchAllData } from "@/utils/fetchData";
import { openDB } from "idb";
import { v4 as uuidv4 } from "uuid";

const ProductContext = createContext({
  products: [],
  isLoading: true,
});

const initializeDB = async () => {
  return openDB("ProductDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", { keyPath: "_id" });
      }
    },
  });
};

const getDataFromDB = async (db) => {
  return db.getAll("products");
};

const saveDataToDB = async (db, data) => {
  const tx = db.transaction("products", "readwrite");
  const store = tx.objectStore("products");

  await store.clear();

  console.log("Products to save:", data);

  await Promise.all(
    data.map((product) => {
      if (
        !product._id ||
        typeof product._id !== "string" ||
        product._id.trim() === ""
      ) {
        console.warn("Invalid `_id` in product:", product);
        product._id = uuidv4();
      }
      return store.put(product);
    })
  );

  await tx.done;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      console.log("Fetching products...");

      const db = await initializeDB();

      const cachedProducts = await getDataFromDB(db);

      if (cachedProducts.length > 0) {
        console.log("Using cached products from IndexedDB...");
        setProducts(cachedProducts);
        setIsLoading(false);
        return;
      }

      const { products } = await fetchAllData();
      console.log("Fetched products:", products);

      const invalidProducts = products.filter(
        (product) =>
          !product._id ||
          typeof product._id !== "string" ||
          product._id.trim() === ""
      );
      if (invalidProducts.length > 0) {
        console.warn("Products with invalid `_id`:", invalidProducts);
      }

      setProducts(products);

      await saveDataToDB(db, products);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, isLoading }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
