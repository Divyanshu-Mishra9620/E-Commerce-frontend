import { createContext, useState, useEffect } from "react";
import { fetchAllData } from "@/utils/fetchData";
import { openDB } from "idb";
import { v4 as uuidv4 } from "uuid";

const ProductContext = createContext({
  products: [],
  isLoading: true,
});
const DB_NAME = "ProductDB";
const DB_VERSION = 2;

const initializeDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      switch (oldVersion) {
        case 0:
        case 1:
          if (!db.objectStoreNames.contains("metadata")) {
            db.createObjectStore("metadata", { keyPath: "id" });
          }
        default:
          if (!db.objectStoreNames.contains("products")) {
            db.createObjectStore("products", { keyPath: "id" });
          }
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
      if (!product.id) {
        product.id = uuidv4();
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
      console.log("Fetching wait bhai...");

      const db = await initializeDB().catch(async (error) => {
        if (error.name === "VersionError") {
          console.log("Database version conflict, resetting...");
          await deleteDB(DB_NAME);
          return initializeDB();
        }
        throw error;
      });
      console.log("db", db);

      const cachedProducts = await getDataFromDB(db);

      if (cachedProducts.length > 0) {
        setProducts(cachedProducts);
        setIsLoading(false);
        return;
      }

      const { products } = await fetchAllData();
      console.log("Fetch ho gya:", products);
      console.log(products);

      setProducts(products);

      await saveDataToDB(db, products);
    } catch (error) {
      console.error("❌❌❌❌❌❌❌❌ Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDB = (name) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = resolve;
      request.onerror = reject;
      request.onblocked = () => reject("Database blocked");
    });
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
