import { Link } from 'react-router-dom';
import WhiteLogoImg from '../../public/assets/images/logo/white-logo.png';

const LogoWhite = (props) => {
    return (
        <Link to="/" className={`d-flex align-items-center text-decoration-none py-1 ${props.className || ''}`}>
            <img 
                src={WhiteLogoImg} 
                alt="Promoter Property Logo" 
                style={{ 
                    maxHeight: props.height || '48px', 
                    width: 'auto', 
                    objectFit: 'contain'
                }} 
            />
        </Link>
    );
};

export default LogoWhite;