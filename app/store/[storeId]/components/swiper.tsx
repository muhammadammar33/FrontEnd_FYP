"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// If you want navigation/pagination, import those modules as well:
// import { Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/css";
// If you need navigation/pagination styles:
// import "swiper/css/navigation";
// import "swiper/css/pagination";

import { Billboard as BillboardType } from "@/types";

interface BillboardsCarouselProps {
    billboards: BillboardType[];
}

const BillboardsCarousel: React.FC<BillboardsCarouselProps> = ({ billboards }) => {
    return (
        <Swiper
            spaceBetween={50}
            slidesPerView={1}
            // If you want navigation/pagination:
            // modules={[Navigation, Pagination]}
            // navigation
            // pagination={{ clickable: true }}
            >
            {billboards.map((billboard) => (
                <SwiperSlide key={billboard.id}>
                {/* <Billboard data={billboard} /> */}
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default BillboardsCarousel;
