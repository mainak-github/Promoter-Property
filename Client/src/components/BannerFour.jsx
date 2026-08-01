
import TabFilterFour from '../common/TabFilterFour';

const BannerFour = () => {
    return (
        <section className="banner-four">
            <div className="banner-four__thumb">
                <img src="assets/images/thumbs/banner-four-image.png" alt=""/>
            </div>
            <img src="assets/images/shapes/pyramid-shape.png" alt="Shape" className="banner-four-shape one"/>
            <img src="assets/images/shapes/angle-left.png" alt="Shape" className="banner-four-shape two"/>
            <img src="assets/images/shapes/angle-right.png" alt="Shape" className="banner-four-shape three"/>
            <div className="banner-four__inner" 
                style={{
                    backgroundColor: 'hsl(var(--white))',
                    WebkitMaskImage: `url(assets/images/shapes/banner-four-shape.png)`,
                    maskImage: `url(assets/images/shapes/banner-four-shape.png)`,
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                }}
            >
                <div className="container">
                    <div className="banner-four-content">
                        <span className="banner-four-content__subtitle">FinTech Fusion</span>
                        <h1 className="banner-four-content__title">Invest today in You <span className="text-gradient">Dream Home</span> </h1>
                        <div className="banner-four-content__tab">
                            <TabFilterFour/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerFour;