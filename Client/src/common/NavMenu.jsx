    import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navMenus } from '../data/CommonData/CommonData';

const NavMenu = (props) => {

    const [activeIndex, setActiveIndex] = useState(null);

    const handleDropdownOpen = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const location = useLocation(); 

    return (
        <>
            <ul className={`nav-menu flx-align ${props.navMenusClass}`}>
                {
                    navMenus.map((navMenu, index) => {

                        const isActiveNavMenu = location.pathname === navMenu.path; 
                        const isActiveSubMenu = navMenu.submenus && navMenu.submenus.some(submenu => location.pathname === submenu.path); 

                        // add activePage class
                        const isActivePage = isActiveNavMenu || isActiveSubMenu;
                        
                        return (
                            <li
                                className={`nav-menu__item 
                                    ${ navMenu.submenus && navMenu.submenus.length > 0 ? 'has-submenu' : '' } 
                                    ${isActivePage ? 'activePage' : ''}
                                `}
                                key={index}
                                onClick={() => handleDropdownOpen(index)}
                            >
                                <NavLink to={navMenu.path} className="nav-menu__link">{navMenu.text}</NavLink>
                                {
                                    navMenu.submenus && navMenu.submenus.length > 0 && (
                                        <ul className="nav-submenu">
                                            {
                                                navMenu.submenus.map((submenu, subIndex) => (
                                                    <li className={`nav-submenu__item ${location.pathname === submenu.path ? 'activePage' : ''}`} key={subIndex}>
                                                        <Link to={submenu.path} className="nav-submenu__link">{submenu.text}</Link>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    )
                                }
                            </li>
                        )
                    })
                }
            </ul>   
        </>
    );
};

export default NavMenu;

