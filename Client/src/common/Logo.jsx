import { Link } from 'react-router-dom';
import LogoImg from '../../public/assets/images/logo/logo.png';

const Logo = (props) => {
    return (
        <Link to="/" className={`d-flex align-items-center text-decoration-none py-1 ${props.className || ''}`}>
            <img 
                src={LogoImg} 
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

export default Logo;