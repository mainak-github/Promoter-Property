/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { getCurrentMonth, slugURL } from '../../utility/Utility';

const BlogClassicItem = ({ blogItem }) => {

    // Get Current month form utility
    const currentMonthName = getCurrentMonth();  

    const { thumb, meta, title, admin, desc, linkText} = blogItem; 
    
    const blogURL = slugURL({url: 'blog', slug: title}); 
    
    return (
        <>
            <div className="blog-item blog-classic-item d-flex">
                <div className="blog-item__thumb d-flex position-relative">
                    <Link to={blogURL} state={{ thumb, title, admin, desc}} className="blog-item__thumb-link">
                        <img src={thumb} className="cover-img" alt=""/>
                    </Link>
                    <span className="blog-item__date font-12"> {new Date().getDate()} {currentMonthName}</span>
                </div>
                <div className="blog-item__content">
                    <ul className="text-list border-0 p-0 flx-align">
                        {
                            meta.map((metaInfo, metaIndex) => {
                                return (
                                    <li className="text-list__item font-12" key={metaIndex}> 
                                        <span className="icon text-gradient">{metaInfo.icon}</span> 
                                        <Link to="/" className="link">{metaInfo.text}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <h5 className="blog-item__title">
                        <Link to={blogURL} state={{ thumb, title, admin, desc}} className="blog-item__title-link"> 
                            {title}
                        </Link>
                    </h5>

                    <p className="blog-item__desc font-18"> {desc}</p>
                    
                    <Link to={blogURL} state={{ thumb, title, admin, desc}} className="btn btn-outline-main btn-outline-main-white">
                        {linkText}
                        <span className="icon-right icon"> 
                            <i className="fas fa-arrow-right"></i> 
                        </span>
                    </Link>
                </div>
            </div>   
        </>
    );
};

export default BlogClassicItem;