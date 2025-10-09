
import { Link } from 'react-router-dom';



const LogoWhite = () => {
    return (
        <>
            <Link to="/" className="mobile-menu__logo">
                {/* <img src={LogoWhiteImage} alt="Logo"/> */}
                <span className="fs-3 fw-bolder text-light">Promoter Property</span>
            </Link>   
        </>
    );
};

export default LogoWhite;