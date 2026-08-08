import React from 'react';

import CommentThumb1 from '../../public/assets/images/thumbs/comment1.png';
import CommentThumb2 from '../../public/assets/images/thumbs/comment2.png';
import { Link } from 'react-router-dom';

const Comment = () => {
    return (
        <>
            <div className="col-lg-12 pt-5">
                <h5 className="comment-title mb-4 mb-lg-5">2 Comment</h5>
                <ul className="comment-list">
                    <li className="comment-list__item d-flex">
                        <div className="comment-list__thumb">
                            <img src={CommentThumb1} className="cover-img" alt=""/>
                        </div>
                        <div className="comment-list__content">
                            <div className="flx-align gap-2 gap-sm-4">
                                <h6 className="comment-list__name font-16">Stanio lainto</h6>
                                <span className="comment-list__date">December 16, 2023</span>
                                <ul className="social-list mt-0 p-0 border-0 gap-3">
                                    <li className="social-list__item">
                                        <a href="https://www.instagram.com/promoterproperty?utm_source=qr&igsh=MTVtZnJxMjYxcG91eg==" target="_blank" rel="noopener noreferrer" className="social-list__link text-gradient font-12 flx-center"><i className="fab fa-instagram"></i></a>
                                    </li>
                                    <li className="social-list__item">
                                        <a href="https://www.facebook.com/share/1BBdx1c4CL/" target="_blank" rel="noopener noreferrer" className="social-list__link text-gradient font-12 flx-center"><i className="fab fa-facebook-f"></i></a>
                                    </li>
                                    <li className="social-list__item">
                                        <a href="https://youtube.com/@promoterproperty?si=y9aPCEntj3KRw35z" target="_blank" rel="noopener noreferrer" className="social-list__link text-gradient font-12 flx-center"><i className="fab fa-youtube"></i></a>
                                    </li>
                                </ul>
                            </div>
                            <p className="comment-list__desc">Ished fact that a reader will be distrol acted bioii the.ished fact that a reader will be distrol acted laoreet Aliquam fact that a reader will be distrol acted Aliquam eros justo.</p>
                            <a className="comment-list__reply" href="#comment-box"> Reply </a>
                        </div>
                    </li>
                    <li className="comment-list__item d-flex">
                        <div className="comment-list__thumb">
                            <img src={CommentThumb2} className="cover-img" alt=""/>
                        </div>
                        <div className="comment-list__content">
                            <div className="flx-align gap-2 gap-sm-4">
                                <h6 className="comment-list__name font-16">Court Henry</h6>
                                <span className="comment-list__date">December 16, 2023</span>
                                <ul className="social-list mt-0 p-0 border-0 gap-3">
                                    <li className="social-list__item">
                                        <a href="https://www.instagram.com/promoterproperty?utm_source=qr&igsh=MTVtZnJxMjYxcG91eg==" target="_blank" rel="noopener noreferrer" className="social-list__link text-gradient font-12 flx-center"><i className="fab fa-instagram"></i></a>
                                    </li>
                                    <li className="social-list__item">
                                        <a href="https://www.facebook.com/share/1BBdx1c4CL/" target="_blank" rel="noopener noreferrer" className="social-list__link text-gradient font-12 flx-center"><i className="fab fa-facebook-f"></i></a>
                                    </li>
                                    <li className="social-list__item">
                                        <a href="https://youtube.com/@promoterproperty?si=y9aPCEntj3KRw35z" target="_blank" rel="noopener noreferrer" className="social-list__link text-gradient font-12 flx-center"><i className="fab fa-youtube"></i></a>
                                    </li>
                                </ul>
                            </div>
                            <p className="comment-list__desc">Ished fact that a reader will be distrol acted bioii the.ished fact that a reader will be distrol acted laoreet Aliquam fact that a reader will be distrol acted Aliquam eros justo.</p>
                            <a className="comment-list__reply" href="#comment-box"> Reply </a>
                        </div>
                    </li>
                </ul>
            </div>   
        </>
    );
};

export default Comment;