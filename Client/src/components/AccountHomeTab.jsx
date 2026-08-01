
import { Link, useLocation } from 'react-router-dom';

const AccountHomeTab = () => {
    const location = useLocation();
    const {userData} = location.state || {};

    if (!userData) {
        return <p>No user data available. Please log in again.</p>;
    }

    return (
        <>
            <p className="account-alert">Hello <strong className="text-heading fw-500 text-poppins">{location.state.userData.username}</strong> (not  <strong className="text-heading fw-500 text-poppins">{userData.username}</strong>? <Link to="/login">Log out</Link> ) </p>
            <p className="account-alert">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>
        </>
    );
};

export default AccountHomeTab;