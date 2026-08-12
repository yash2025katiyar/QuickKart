import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  "All",
  "Fruits & Vegetables",
  "Dairy & Breakfast",
  "Snacks",
  "Beverages",
  "Personal Care",
  "Household",
  "Bakery",
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== "All") params.category = category;
        if (keyword) params.keyword = keyword;
        const { data } = await API.get("/products", { params });
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, keyword]);

  return (
    <div className="home">
      

      <div className="category-scroller">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`category-chip ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="loading-text">No products found. Try a different search.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
