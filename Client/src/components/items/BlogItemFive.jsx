/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';
import { getCurrentMonth, slugURL } from '../../utility/Utility';

const BlogItemFive = ({blogItem}) => {
    
   // Get Current month form utility
   const currentMonthName = getCurrentMonth();  

    // eslint-disable-next-line no-unused-vars
    const { thumb, meta, title, admin, desc, linkText} = blogItem;  
    
    // Title Convert To Slug
    const blogURL = slugURL({url: 'blog', slug: title}); 

    return (
        <div className="blog-item rounded-3 overflow-hidden">
            <div className="blog-item__thumb">
                <Link to={blogURL} state={{ thumb, title, admin, desc}} className="blog-item__thumb-link">
                    <img src={thumb} className="cover-img" alt=""/>
                </Link>
                <span className="blog-item__date style-three font-20 end-0 left-auto top-0 bg-white"> 
                {new Date().getDate()}  <span className="text-body d-block font-16 fw-light">{currentMonthName}</span> 
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
                <p className="blog-item__title mb-0 font-18 line-clamp-2"> {desc}</p>
                
            </div>
        </div>   
    );
};

export default BlogItemFive;