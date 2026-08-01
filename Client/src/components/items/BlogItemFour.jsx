/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';
import { getCurrentMonth, slugURL } from '../../utility/Utility';

const BlogItemFour = ({blogItem}) => {
    
   // Get Current month form utility
   const currentMonthName = getCurrentMonth();  

    const { thumb, meta, title, admin, desc, linkText} = blogItem; 
    
    // Title Convert To Slug
    const blogURL = slugURL({url: 'blog', slug: title}); 

    return (
        <div className="blog-item">
            <div className="blog-item__thumb">
                <Link to={blogURL} state={{ thumb, title, admin, desc}} className="blog-item__thumb-link">
                    <img src={thumb} className="cover-img" alt=""/>
                </Link>
                <span className="blog-item__date style-three font-18"> 
                    {new Date().getDate()}  <span className="text">{currentMonthName}</span>
                </span>
            </div>
            <div className="blog-item__content bg-white border-0">
                <ul className="text-list border-0 p-0 flx-align">
                    {
                        meta.map((metaInfo, metaIndex) => {
                            return (
                                <li className="text-list__item font-12" key={metaIndex}> 
                                    <span className="icon text-gradient">{metaInfo.icon}</span> 
                                    <Link to={blogURL} state={{ thumb, title, admin, desc}} className="link">{metaInfo.text}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
                <h6 className="blog-item__title mb-4">
                    <Link to={blogURL} state={{ thumb, title, admin, desc}} className="blog-item__title-link border-effect"> {title}</Link>
                </h6>

                <Link to={blogURL} state={{ thumb, title, admin, desc}} className="btn btn-outline-light"> 
                    {linkText}
                    <span className="icon-right text-gradient"> <i className="fas fa-arrow-right"></i> </span>
                </Link>
                
            </div>
        </div>   
    );
};

export default BlogItemFour;