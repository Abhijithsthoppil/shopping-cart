import BannerSection from "@components/Banner/BannerSection";
import ProductsGrid from "@components/Products/ProductsGrid";
import React from "react";
const Home: React.FC = () => {
    return (
        <div className="flex">
            {/* Banner section with sliding component */}
            <div className="w-full min-h-[850px] bg-white items-center justify-center rounded-b-3xl">
                <BannerSection />
                <ProductsGrid />
            </div>
    </div>
    )
}
export default Home;
