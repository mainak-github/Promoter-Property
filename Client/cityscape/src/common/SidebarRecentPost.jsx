import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { blogs } from '../data/HomeOneData/HomeOneData';
import { slugURL } from '../utility/Utility';

const SidebarRecentPost = () => {

    return (
        <>
            {
                blogs.slice(0, 3).map((blogItem, blogItemIndex) => {

                    const {title, thumb, admin, desc} = blogItem; 
                    
                    // Title Convert To Slug
                    const blogURL = slugURL({url: 'blog', slug: title}); 
                    
                    return (
                        <div className="latest-blog" key={blogItemIndex}>
                            <div className="latest-blog__thumb">
                                <Link to={blogURL} state={{ thumb, title, admin, desc}}> 
                                    <img src={thumb} className="cover-img" alt=""/>
                                </Link>
                            </div>
                            <div className="latest-blog__content">
                                <span className="latest-blog__category font-12 flx-align gap-1">
                                    <span className="icon text-gradient"><i className="fas fa-folder-open"></i></span>
                                Category</span>
                                <h6 className="latest-blog__title">
                                    <Link to={blogURL} state={{ thumb, title, admin, desc}}>{title}</Link>
                                </h6>
                            </div>
                        </div>
                    )
                })
            }
        </>
    );
};

export default SidebarRecentPost;