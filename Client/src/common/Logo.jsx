import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link to="/" className="d-flex align-items-center text-decoration-none py-1">
            <span className="fw-bold fs-4 tracking-tight" style={{ color: '#000000', letterSpacing: '-0.5px' }}>
                PromoterProperty
            </span>
        </Link>
    );
};

export default Logo;