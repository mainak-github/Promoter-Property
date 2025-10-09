import{ useEffect, useRef } from "react";

const MarqueeSlider = () => {

    const sliderRef = useRef(null);

    useEffect(() => {
    const slider = sliderRef.current;

    // Duplicates the slider content to achieve continuous effect
    const duplicateSlider = () => {
        const clone = slider.cloneNode(true);
        slider.parentElement.appendChild(clone);
    };

    duplicateSlider();

    return () => {
        if (slider?.parentElement?.children.length > 1) {
        slider.parentElement.removeChild(slider.parentElement.lastChild);
        }
    };
    }, []);

  return (
    <div className="service-slider-section overflow-hidden">
        <div className="service-slider-wrapper d-flex">
            <div ref={sliderRef} className="service-slider d-flex flex-shrink-0">
                <div className="service-slider__item flex-shrink-0 d-flex align-items-center gap-3">
                    <span className="service-slider__icon">
                        <img src="assets/images/icons/service-slider-icon1.svg" alt="" />
                    </span>
                    <h2 className="service-slider__text mb-0 fw-semibold">Infinite Insight Realty</h2>
                </div>
                <div className="service-slider__item flex-shrink-0 d-flex align-items-center gap-3">
                    <span className="service-slider__icon">
                        <img src="assets/images/icons/service-slider-icon2.svg" alt="" />
                    </span>
                    <h2 className="service-slider__text mb-0 fw-semibold">Elite Scape</h2>
                </div>
                <div className="service-slider__item flex-shrink-0 d-flex align-items-center gap-3">
                    <span className="service-slider__icon">
                        <img src="assets/images/icons/service-slider-icon3.svg" alt="" />
                    </span>
                    <h2 className="service-slider__text mb-0 fw-semibold">Capital Crest Estates</h2>
                </div>
                <div className="service-slider__item flex-shrink-0 d-flex align-items-center gap-3">
                    <span className="service-slider__icon">
                        <img src="assets/images/icons/service-slider-icon4.svg" alt="" />
                    </span>
                    <h2 className="service-slider__text mb-0 fw-semibold">Property Consultants</h2>
                </div>
            </div>
        </div>
    </div>
  );
};

export default MarqueeSlider;