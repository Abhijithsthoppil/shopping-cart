// src/hooks/useProductFilters.ts

import { useState } from "react";

// Define the structure of a product
interface Product {
  id: number;
  name: string;
  image_url: string;
  price: number;
  category: string;
  brand: string;
  description: string;
}

type Filters = {
  categories: string[];
  brands: string[];
  sortOptions: string[];
};

export const useProductFilters = (products: Product[], filters: Filters) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("Recommended");

  // Handle changes in categories and brands
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Filter and sort products based on selected filters
  const filteredProducts = products
    .filter((product) => {
      return (
        (selectedCategories.length === 0 || selectedCategories.includes(product.category)) && // Filter by selected categories
        (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) // Filter by selected brands
      );
    })
    .sort((a, b) => {
      if (sortOption === "Price: Low to High") return a.price - b.price;
      if (sortOption === "Price: High to Low") return b.price - a.price;
      return 0;
    });

  return {
    selectedCategories,
    handleCategoryChange,
    selectedBrands,
    handleBrandChange,
    sortOption,
    setSortOption,
    filteredProducts,
    filters,
  };
};
