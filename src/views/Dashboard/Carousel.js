import React from "react";
import { Button } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import styled, { keyframes } from "styled-components";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BlurBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-in-out;
  z-index: 1000;
`;

const CarouselContainer = styled.div`
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
`;

const Carousel = ({
  selectedCardImages,
  handleSelectCard,
  closeCarousel,
  globalCarouselIndex,
}) => {
  return (
    <BlurBackground onClick={closeCarousel}>
      <CarouselContainer onClick={(e) => e.stopPropagation()}>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3} // Show more slides at once
          coverflowEffect={{
            rotate: 30, // Adjust the rotation angle
            stretch: 10, // Adjust the stretch between slides
            depth: 100, // Adjust the depth of the slides
            modifier: 1,
            slideShadows: true,
          }}
          navigation
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Navigation, Pagination]}
          onSlideChange={(swiper) => {
            globalCarouselIndex = swiper.activeIndex;
          }}
        >
          {selectedCardImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Card face ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Button
          mt={4}
          colorScheme="teal"
          onClick={handleSelectCard}
          display="block"
          mx="auto"
        >
          Select Card
        </Button>
      </CarouselContainer>
    </BlurBackground>
  );
};

export default Carousel;
