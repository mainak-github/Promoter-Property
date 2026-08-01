
import { galleries } from '../data/HomeTwoData/HomeTwoData';
import { Link } from 'react-router-dom';
import SectionHeading from '../common/SectionHeading';

const Gallery = () => {
    
    return (
        <section className="gallery-section padding-y-60">
            <div className="container container-two">
                
                <SectionHeading
                    headingClass=""  
                    subtitle="Our Gallery"
                    subtitleClass="" 
                    title="Unlocking the door to your a the new home" 
                    renderDesc={false}
                    desc=""
                    renderButton={false}
                    buttonClass="btn-main"
                    buttonText="View More"
                />

                <div className="row gy-4">
                    {
                        galleries.map((gallery, galleryIndex) => {
                            return (            
                                <div className={` ${galleryIndex === 1 || galleryIndex === 2 ? 'col-lg-8 col-sm-7 col-xs-6' : 'col-lg-4 col-sm-5 col-xs-6'}`} key={galleryIndex}>
                                    <div className="gallery-thumb">
                                        <img src={gallery.image} alt="Gallery Image" className="cover-img"/>
                                        <Link to={gallery.image} className="gallery-thumb__link gallery-popup">
                                            {gallery.icon}
                                        </Link>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    );
};

export default Gallery;