import React from 'react';

const ScrollToTop = () => {

    // Scroll To Top 
    const [position, setPosition] = React.useState({top: 0, left: 0})

    React.useEffect(() => {
        window.scroll({
            top: position.top,
            left: position.left,
            behavior: 'smooth'
        })
    })

    const [visibility, setVisibility] = React.useState(false)
    
    const scrollTop = React.useRef()
    React.useEffect(() => {
        window.addEventListener('scroll', (e) => {
            window.scrollY > 200 
            ? scrollTop.current.style.visibility = 'visible'
            : scrollTop.current.style.visibility = 'hidden'
        })
    }) 
    
    const scrollToTopHandler = () => {
        setPosition({ top: 0, left: 0 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <button
                type="button"
                className="scrollToTop"  
                onClick={scrollToTopHandler}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToTopHandler(); }}
                ref={scrollTop}
                aria-label="Scroll to top of page"
                style={{ border: 'none', background: 'transparent' }}
            >
                <i className="fas fa-chevron-up text-gradient" aria-hidden="true"></i>
            </button>
        </>
    );
};

export default ScrollToTop;