/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import{ useContext, useEffect, useState } from 'react';
// import NavMenu from './NavMenu';
import Logo from './Logo';
import { MobileMenuContext } from '../contextApi/MobileMenuContext';
import { OffCanvasContext } from '../contextApi/OffCanvasContext';
import { ScrollHideContext } from '../contextApi/ScrollHideContext';
import Button from './Button';
import { Link } from 'react-router-dom';
import LogoWhite from './LogoWhite';
import {  toast } from 'react-toastify';
const Header = (props) => {


    let dashboard_link = '/'; // default

    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'admin') {
            dashboard_link = '/admin/dashboard';
        } else if (user?.role === 'client') {
            dashboard_link = '/user/dashboard';
        } else if (user?.role === 'broker') {
            dashboard_link = '/broker/dashboard';
        }
    } catch (error) {
        console.error("User not found or invalid JSON in localStorage", error);
    }

    const { handleMobileMenuClick } = useContext(MobileMenuContext);

    const { handleOffCanvas } = useContext(OffCanvasContext);

    // eslint-disable-next-line no-unused-vars
    const { handleScrollHide, handleScrollHideLg } = useContext(ScrollHideContext);

    // Sticky header Code 
    const [stickyHeader, setStickyHeader] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', function () {
            window.scrollY > 100 ? setStickyHeader(true) : setStickyHeader(false)
        });
    }, []);


    // Logout
        
            const logoutHandler = () => {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                toast.success('Logged out successful!');
                window.location.href = '/'
            }

    return (
        <>
           
            {/* ==================== Header Start Here ==================== */}
            <header className={`header ${props.headerClass} ${stickyHeader ? 'fixed-header' : ''}`}>
                <div className="container container-two">
                    <nav className="header-inner flx-between">

                        {
                            props.logoBlack && (
                                <div className="logo">
                                    <Logo />
                                </div>
                            )
                        }

                        {
                            props.logoWhite && (
                                <div className="logo">
                                    <LogoWhite />
                                </div>
                            )
                        }

                        {/* Menu Start  */}
                        <div className={`header-menu d-lg-block d-none ${props.headerMenusClass}`}>
                            {localStorage.getItem('user') && localStorage.getItem('token') ? <ul className="ist-unstyled d-flex gap-3">
                                <li className='list-inline-item'><a className='text-dark fs-4' href="/">Home</a></li>
                                <li className='list-inline-item'><a className='text-dark fs-4' href="/faq">FAQ</a></li>
                                <li className='list-inline-item'><a className='text-dark fs-4' href="/about">About Us</a></li>
                                <li className='list-inline-item'><a className='text-dark fs-4' href="/contact">Contact Us</a></li>
                                <li className='list-inline-item'><a className='text-dark fs-4' href={dashboard_link}>My Account</a></li>
                                <li className='list-inline-item'><button className='text-dark fs-4' onClick={logoutHandler}>Logout</button></li>
                            </ul> :
                                <ul className="list-unstyled d-flex gap-3 align-items-center">
                                    <li className='list-inline-item'><a className='text-dark fs-4' href="/">Home</a></li>
                                    <li className='list-inline-item'><a className='text-dark fs-4' href="/faq">FAQ</a></li>
                                    <li className='list-inline-item'><a className='text-dark fs-4' href="/about">About Us</a></li>
                                    <li className='list-inline-item'><a className='text-dark fs-4' href="/contact">Contact Us</a></li>

                                    <li className="list-inline-item">
                                        <a className="text-dark fs-4" href="/register" >
                                            Register
                                        </a>
                                    </li>
                                 
                                </ul>

                            }
                        </div>
                        {/* Menu End  */}

                        {/* Header Right start */}
                        <div className="header-right flx-align">
                            {
                                props.showContactNumber && (
                                    <Link to="#" className="contact-number text-poppins text-gray-800 fw-500 d-flex align-items-center gap-2">
                                        <span className="icon text-gradient font-20"><i className="fas fa-phone"></i></span>
                                        <span className="text">(629) 555-0129</span>
                                    </Link>
                                )
                            }

                            {/* {
                                props.showOffCanvasBtn && (
                                    <button type="button" className={`offcanvas-btn d-lg-block d-none ${props.offCanvasBtnClass}`}
                                        onClick={() => { handleOffCanvas(); handleScrollHideLg(); }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" viewBox="0 0 30 24" fill="none">
                                            <line x1="0.0078125" y1="12.293" x2="30.0078" y2="12.293" stroke="#181616" strokeWidth="3" />
                                            <path d="M5.00781 22.293H30.0078" stroke="#181616" strokeWidth="3" />
                                            <path d="M10.0078 2.29297H30.0078" stroke="#181616" strokeWidth="3" />
                                        </svg>
                                    </button>
                                )
                            } */}

                            {
                                props.showHeaderBtn && (
                                    <Button
                                        btnLink={props.btnLink}
                                        btnClass={props.btnClass}
                                        btnText={props.btnText}
                                        spanClass={props.spanClass}
                                        iconClass="fas fa-arrow-right"
                                    />
                                )
                            }

                            <button type="button" className="toggle-mobileMenu d-lg-none ms-3"
                                onClick={() => { handleMobileMenuClick(); handleScrollHide(); }}
                            >
                                <i className="las la-bars"></i>
                            </button>
                        </div>

                        {/* Header Right End  */}
                    </nav>
                </div>
            </header>
            {/* ==================== Header End Here ==================== */}
        </>
    );
};

export default Header; 