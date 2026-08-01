import { Link } from 'react-router-dom';

const LogoWhite = () => {
    return (
        <Link to="/" className="d-flex align-items-center text-decoration-none py-1">
            <span className="fw-bold fs-4 tracking-tight text-white" style={{ letterSpacing: '-0.5px' }}>
                PromoterProperty
            </span>
        </Link>
    );
};

export default LogoWhite;