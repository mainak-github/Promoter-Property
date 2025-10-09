

const GalleryFive = () => {
    return (
        <section className="gallery-section padding-y-120 bg-white">
            <div className="container container-two">
                <div className="section-heading">
                    <span className="section-heading__subtitle bg-transparent"> <span className="text-gradient fw-semibold">Our Gallery</span> </span>
                    <h2 className="section-heading__title">Unlocking the door to your a the new home</h2>
                </div>
                
                <div className="row gy-4">
                    <div className="col-lg-4 col-sm-5 col-xs-6">
                        <div className="gallery-thumb">
                            <img src="assets/images/thumbs/gallery-img1.png" alt="" className="cover-img"/>
                            <a href="assets/images/thumbs/gallery-img1.png" className="gallery-thumb__link gallery-popup">
                                <i className="fas fa-expand-alt"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-8 col-sm-7 col-xs-6">
                        <div className="gallery-thumb">
                            <img src="assets/images/thumbs/gallery-img2.png" alt="" className="cover-img"/>
                            <a href="assets/images/thumbs/gallery-img2.png" className="gallery-thumb__link gallery-popup">
                                <i className="fas fa-expand-alt"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-8 col-sm-7 col-xs-6">
                        <div className="gallery-thumb">
                            <img src="assets/images/thumbs/gallery-img3.png" alt="" className="cover-img"/>
                            <a href="assets/images/thumbs/gallery-img3.png" className="gallery-thumb__link gallery-popup">
                                <i className="fas fa-expand-alt"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-5 col-xs-6">
                        <div className="gallery-thumb">
                            <img src="assets/images/thumbs/gallery-img4.png" alt="" className="cover-img"/>
                            <a href="assets/images/thumbs/gallery-img4.png" className="gallery-thumb__link gallery-popup">
                                <i className="fas fa-expand-alt"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GalleryFive;