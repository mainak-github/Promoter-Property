


import { Link } from 'react-router-dom';

const Logo = () => {
    return   (
        <>
            <Link to="/" className="link">
                {/* <img src={LogoImg} alt="Logo"/> */}
                <span className='text-dark fs-3 fw-bolder'>Promoter Property</span>
            </Link>
        </>
    );
};

export default Logo;    