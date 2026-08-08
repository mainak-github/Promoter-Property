/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PropertyFilterContext } from '../../contextApi/PropertyFilterContext';
import { slugURL } from '../../utility/Utility';

const PropertyItem = ({ property, itemClass, iconsClass, btnClass, badgeText, badgeClass, btnRenderBottom, btnRenderRight}) => {

    const { thumb, price, day, title, desc, locationIcon, location, amenities,  btnText, dataSort, dataStatuses, dataTypes, dataLocations } = property; 

    // Details Slug
    const propertyURL = slugURL({url: 'property', slug: title}); 

    // For Random Badge
    const renderBadge = Math.random() < .5;

    // **************** Data Filter Search Code Start ****************
    const {selectedSort, dataStatus, dataType, dataLocation} = useContext(PropertyFilterContext); 

    const shouldHideSort = selectedSort !== 'All' && selectedSort !== property["dataSort"];
    const shouldHideStatus = dataStatus !== 'All' && dataStatus !== property["dataStatuses"];
    const shouldHideType = dataType !== 'All' && dataType !== property["dataTypes"];
    const shouldHideLocation = dataLocation !== 'All' && dataLocation !== property["dataLocations"];

    if (shouldHideSort || shouldHideStatus || shouldHideType || shouldHideLocation) {
        itemClass += " d-none";
    } 
    // **************** Data Filter Search Code End ****************
    
    return (
        <>
            <div className={`property-item ${itemClass}`} 
                datastatus={dataStatuses} 
                datatype={dataTypes} 
                datalocation={dataLocations}
                datasort={dataSort}
            >
                <div className="property-item__thumb">
                    <Link to={propertyURL} state={{ thumb, title, desc, price}} className="link">
                        <img src={thumb} alt={title || "Property"} className="cover-img" loading="lazy" decoding="async" />
                    </Link> 
                    {
                        renderBadge && (
                            <span className={badgeClass}>{badgeText}</span>
                        )
                    }
                </div>
                <div className="property-item__content">    
                    <h6 className="property-item__price">{price}
                        <span className="day">{day}</span> 
                    </h6>
                    <h6 className="property-item__title"> 
                        <Link to={propertyURL} state={{ thumb, title, desc, price}} className="link">{title}</Link> 
                    </h6>
                    <p className="property-item__location d-flex gap-2"> 
                        <span className={`icon ${iconsClass}`}> {locationIcon}</span>
                        {location}
                    </p>
                    <div className="property-item__bottom flx-between gap-2">
                        <ul className="amenities-list flx-align">
                            {
                                amenities.map((amenity, amenityIndex) => {
                                    return (
                                        <li className="amenities-list__item flx-align" key={amenityIndex}>
                                            <span className={`icon ${iconsClass}`}>{amenity.icon}</span>
                                            <span className="text">{amenity.text}</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        {
                            btnRenderRight && (
                                <Link to={propertyURL} state={{ thumb, title, desc, price}} className={`simple-btn ${btnClass}`}>
                                    {btnText}
                                    <span className="icon-right"> <i className="fas fa-arrow-right"></i> </span> 
                                </Link>
                            )
                        }
                    </div>

                    {
                        btnRenderBottom &&
                        (
                            <Link to={propertyURL} state={{ thumb, title, desc, price}} className={`simple-btn ${btnClass}`}>
                                {btnText}
                                <span className="icon-right"> <i className="fas fa-arrow-right"></i> </span> 
                            </Link>
                        )
                    }
                </div>
            </div>   
        </>
    );
};

export default PropertyItem;





