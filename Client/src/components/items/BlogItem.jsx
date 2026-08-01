/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';
import { getCurrentMonth, slugURL } from '../../utility/Utility';

const BlogItem = ({ blog }) => {

    // Get Current month form utility
    const currentMonthName = getCurrentMonth();  

    const { thumb, meta, title, admin, desc, linkText} = blog; 
    
    // Title Convert To Slug
    const blogURL = slugURL({url: 'blog', slug: title}); 

    return (
        <div className="blog-item">
            <div className="blog-item__thumb">
                <Link to={blogURL} state={{ thumb, title, admin, desc}} className="blog-item__thumb-link">
                    <img src={thumb} className="cover-img" alt="Blog Image"/>
                </Link>
            </div>
            <div className="blog-item__inner">
                
                <div className="blog-item__date">
                    {new Date().getDate()}<span className="text">{currentMonthName}</span>
                </div>
                
                <div className="blog-item__content">
                    <ul className="text-list flx-align">
                        {
                            meta.map((metaInfo, metaIndex) => {
                                return (
                                    <li className="text-list__item font-12" key={metaIndex}> 
                                        <span className="icon">{metaInfo.icon}</span> 
                                        <Link to="/" className="link">{metaInfo.text}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <h6 className="blog-item__title">
                        <Link to={blogURL} state={{ thumb, title, admin, desc}} className="blog-item__title-link border-effect"> {title}</Link>
                    </h6>
                    <Link to={blogURL} state={{ thumb, title, admin, desc}} className="simple-btn text-heading fw-semibold"> 
                        {linkText}
                        <span className="icon-right text-gradient"> <i className="fas fa-plus"></i> </span>
                    </Link>
                </div>
            </div>
        </div>   
    );
};

export default BlogItem;