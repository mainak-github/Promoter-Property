/* eslint-disable react/prop-types */


import { Link } from 'react-router-dom';
import { getCurrentMonth, slugURL } from '../../utility/Utility';

const BlogItemTwo = ({ blog }) => {

    // Get Current month form utility
    const currentMonthName = getCurrentMonth();  

    const { thumb, meta, title, admin, desc, linkText} = blog; 
    
    // Title Convert To Slug
    const blogURL = slugURL({url: 'blog', slug: title}); 

    
    return (
        <div className="blog-item blog-dark">
            <div className="blog-item__thumb">
                <Link to={blogURL} state={{ thumb, title, admin, desc}} className="blog-item__thumb-link">
                    <img src={thumb} className="cover-img" alt=""/>
                </Link>
                <span className="blog-item__date"> {new Date().getDate()} {currentMonthName}</span>
            </div>
            <div className="blog-item__inner">
                <div className="blog-item__content">
                    <ul className="text-list border-0 p-0 flx-align">
                        {
                            meta.map((metaInfo, metaIndex) => {
                                return (
                                    <li className="text-list__item font-12" key={metaIndex}> 
                                        <span className="icon text-gradient">{metaInfo.icon}</span> 
                                        <Link to="/blog-details" className="link text-white fw-light">{metaInfo.text}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <h6 className="blog-item__title">
                        <Link to={blogURL}  state={{ thumb, title, admin, desc}} className="blog-item__title-link border-effect"> {title}</Link>
                    </h6>

                    <Link to={blogURL}  state={{ thumb, title, admin, desc}} className="btn btn-outline-lightInDark text-white fw-normal">
                        {linkText} 
                        <span className="icon-right icon"> 
                            <i className="fas fa-arrow-right"></i>
                        </span> 
                    </Link>
                    
                </div>
            </div>
        </div>
    );
};

export default BlogItemTwo;