import { useProductFilters } from "./hooks/useProductFilters";
import { useCart } from "@context/CartContext";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import { getProducts } from "@services/productService";
import { useSearchParams } from "react-router-dom";

const filters = {
  categories: ["Laptops", "Mobiles", "Cameras", "Headphones", "Tablets"],
  brands: ["Sony", "Samsung", "Apple", "HP", "Lenovo", "Canon"],
  sortOptions: ["Recommended", "Price: Low to High", "Price: High to Low"],
};

interface Product {
  id: number;
  name: string;
  image_url: string;
  price: number;
  category: string;
  brand: string;
  description: string;
}

const ProductList = () => {
  const { addToCart } = useCart()!;
  const [products, setProducts] = useState<Product[]>([]);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const {
    selectedCategories,
    handleCategoryChange,
    selectedBrands,
    handleBrandChange,
    sortOption,
    setSortOption,
    filteredProducts,
  } = useProductFilters(products, filters);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const fetchProducts = async (key: string | null = null) => {
    setLoading(true);
    try {
      const data = await getProducts({ limit: 20, lastKey: key });
      setProducts((prev) => {
        const combined = [...prev, ...data.products];
        const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
        return unique;
      });
      setLastKey(data.last_evaluated_key || null);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const loadMore = () => {
    if (lastKey && !loading) {
      fetchProducts(lastKey);
    }
  };

  // 🔍 Apply search filter to already-filtered products
  const finalFilteredProducts = filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="flex flex-col md:flex-row">
      {/* Filters Toggle Button for Mobile */}
      <div className="md:hidden flex justify-end mb-4 px-6 mt-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2H3V4zM3 8h18v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm6 4h6"
            />
          </svg>
          <span className="font-medium text-sm">
            {showFilters ? "Hide Filters" : "Show Filters"}
          </span>
        </button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`
        w-full md:w-72 p-6 bg-white/80 backdrop-blur border border-gray-100 shadow-xl rounded-3xl
        md:sticky md:top-0 md:h-screen md:block
        transition-all space-y-10
        ${showFilters ? "block" : "hidden"} md:block
      `}>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Filters</h2>

          {/* Categories */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</h3>
            <div className="space-y-3">
              {filters.categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-indigo-600 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-150 focus:outline-none"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Brands */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4">Brand</h3>
            <div className="space-y-3">
              {filters.brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-indigo-600 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-150 focus:outline-none"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </aside>

      {/* Products Section */}
      <main className="flex-1 p-6 md:ml-8 md:mr-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Electronics</h1>
          <div className="flex justify-end">
            <div className="relative w-44">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm py-2 px-3 appearance-none"
              >
                {filters.sortOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">▼</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {finalFilteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {lastKey && !loading && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
            >
              Load More
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center mt-4 text-gray-500">Loading...</div>
        )}
      </main>
    </div>
  );
};

export default ProductList;
