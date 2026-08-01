/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import Logo from './Logo';
import LogoWhite from './LogoWhite';
import { MobileMenuContext } from '../contextApi/MobileMenuContext';
import { OffCanvasContext } from '../contextApi/OffCanvasContext';
import { ScrollHideContext } from '../contextApi/ScrollHideContext';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = (props) => {
    const location = useLocation();
    let dashboard_link = '/';

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
    const { handleScrollHide, handleScrollHideLg } = useContext(ScrollHideContext);

    const [stickyHeader, setStickyHeader] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setStickyHeader(true);
            } else {
                setStickyHeader(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        toast.success('Logged out successfully!');
        window.location.href = '/';
    };

    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Properties', path: '/property' },
        { title: 'FAQ', path: '/faq' },
        { title: 'About Us', path: '/about' },
        { title: 'Contact Us', path: '/contact' },
    ];

    const isAuthenticated = localStorage.getItem('user') && localStorage.getItem('token');

    return (
        <>
            <header className={`modern-header ${props.headerClass || ''} ${stickyHeader ? 'modern-header-sticky' : ''}`}>
                <div className="container container-two">
                    <nav className="d-flex align-items-center justify-content-between py-2">
                        {/* Logo */}
                        <div className="header-brand">
                            {props.logoWhite ? <LogoWhite /> : <Logo />}
                        </div>

                        {/* Navigation Menu */}
                        <div className={`header-menu-wrapper d-lg-block d-none ${props.headerMenusClass || ''}`}>
                            <ul className="d-flex align-items-center gap-1 m-0 p-0 list-unstyled">
                                {navLinks.map((item, index) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <li key={index}>
                                            <Link
                                                to={item.path}
                                                className={`nav-custom-link ${isActive ? 'active' : ''}`}
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    );
                                })}

                                {isAuthenticated ? (
                                    <>
                                        <li>
                                            <Link
                                                to={dashboard_link}
                                                className={`nav-custom-link ${location.pathname.includes('/dashboard') ? 'active' : ''}`}
                                            >
                                                My Account
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                className="nav-logout-btn"
                                                onClick={logoutHandler}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <Link
                                            to="/register"
                                            className={`nav-custom-link ${location.pathname === '/register' ? 'active' : ''}`}
                                        >
                                            Register
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Right Section */}
                        <div className="header-right-action d-flex align-items-center gap-3">
                            {props.showContactNumber && (
                                <Link to="#" className="contact-phone-badge d-none d-md-flex align-items-center gap-2">
                                    <span className="phone-icon-pill"><i className="fas fa-phone-alt"></i></span>
                                    <span className="phone-number-text">(629) 555-0129</span>
                                </Link>
                            )}

                            {props.showHeaderBtn && (
                                <Link
                                    to={isAuthenticated ? dashboard_link : (props.btnLink && props.btnLink !== '/property' ? props.btnLink : '/login')}
                                    className="sell-property-btn d-none d-sm-inline-flex align-items-center gap-2"
                                >
                                    <i className={isAuthenticated ? "fas fa-user-circle fs-6" : "far fa-user fs-6"}></i>
                                    <span>
                                        {isAuthenticated
                                            ? 'My Account'
                                            : (props.btnText && props.btnText !== 'Sell Property' && props.btnText !== 'Add Listing'
                                                ? props.btnText
                                                : 'Login / Register')}
                                    </span>
                                </Link>
                            )}

                            {/* Mobile Hamburger Toggle */}
                            <button
                                type="button"
                                className="mobile-toggle-btn d-lg-none"
                                onClick={() => { handleMobileMenuClick(); handleScrollHide(); }}
                                aria-label="Toggle Navigation Menu"
                            >
                                <i className="las la-bars"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Custom Modern Header Styling */}
            <style>{`
                .modern-header {
                    position: relative;
                    top: 0;
                    left: 0;
                    width: 100%;
                    z-index: 999;
                    background: #ffffff;
                    border-bottom: 1px solid #f1f5f9;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .modern-header-sticky {
                    position: sticky;
                    top: 0;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);
                    border-bottom-color: rgba(226, 232, 240, 0.8);
                }

                .nav-custom-link {
                    display: inline-block;
                    padding: 8px 16px;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: #475569;
                    text-decoration: none;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }

                .nav-custom-link:hover {
                    color: #0f172a;
                    background-color: #f8fafc;
                }

                .nav-custom-link.active {
                    color: #0f172a;
                    font-weight: 600;
                    background-color: #f1f5f9;
                }

                .nav-logout-btn {
                    border: none;
                    background: transparent;
                    padding: 8px 16px;
                    font-size: 0.9375rem;
                    font-weight: 500;
                    color: #ef4444;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }

                .nav-logout-btn:hover {
                    background-color: #fef2f2;
                }

                .sell-property-btn {
                    padding: 9px 22px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #ffffff !important;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border-radius: 50px;
                    text-decoration: none;
                    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
                    transition: all 0.3s ease;
                    border: none;
                }

                .sell-property-btn:hover {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.35);
                    transform: translateY(-1px);
                }

                .sell-property-btn .btn-arrow-icon {
                    font-size: 0.8rem;
                    transition: transform 0.2s ease;
                }

                .sell-property-btn:hover .btn-arrow-icon {
                    transform: translateX(3px);
                }

                .contact-phone-badge {
                    text-decoration: none;
                    color: #334155;
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 6px 14px;
                    border-radius: 50px;
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s ease;
                }

                .contact-phone-badge:hover {
                    color: #2563eb;
                    border-color: #bfdbfe;
                    background-color: #eff6ff;
                }

                .phone-icon-pill {
                    color: #2563eb;
                    font-size: 0.85rem;
                }

                .mobile-toggle-btn {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    background: #ffffff;
                    color: #0f172a;
                    font-size: 1.4rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .mobile-toggle-btn:hover {
                    background-color: #f8fafc;
                    border-color: #cbd5e1;
                }
            `}</style>
        </>
    );
};

export default Header;