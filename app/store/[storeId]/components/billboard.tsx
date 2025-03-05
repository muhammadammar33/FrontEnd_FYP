import { Billboard as BillboardType } from '@/types';
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


// interface Billboard {
//     id: string;
//     label: string;
//     imageUrl: string;
//     createdAt: Date;
//     updatedAt: Date;
//     storeId: string;
// }

interface BillboardProps {
    data: BillboardType;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 rounded-xl">
            <Carousel>
                <CarouselContent>
                    <CarouselItem key={data.id}>
                        <div className="relative aspect-square md:aspect-[2.4/1] overflow-hidden rounded-xl">
                            <Image
                                src={data.imageUrl}
                                alt={data.label}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <h2 className="text-3xl font-bold text-white sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs">
                                    {data.label}
                                </h2>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            {/* <Swiper
                spaceBetween={50}
                slidesPerView={3}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                >
                <SwiperSlide>Slide 1</SwiperSlide>
                <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
                ...
            </Swiper> */}
        </div>
    );
};

export default Billboard;