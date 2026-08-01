
import { useLocation } from 'react-router-dom';

const AccountProfileTab = () => {
    const location = useLocation();
    const {userData} = location.state || {};
    
    return (
        <>
            <div className="card common-card mb-4">
                <div className="card-body">
                    <div className="profile-info d-flex gap-4 align-items-center">
                        <div className="profile-info__thumb">
                            <img src="assets/images/thumbs/team1.png" alt=""/>
                        </div>
                        <div className="profile-info__content">
                            <span className="mb-1 fw-semibold text-main text-poppins font-13">Agent of Property</span>
                            <h4 className="profile-info__title text-poppins mb-4">{userData.username}</h4>

                            <div className="contact-info d-flex gap-3 align-items-center mb-2">
                                <span className="contact-info__icon text-gradient"><i className="fas fa-map-marker-alt"></i></span>
                                <div className="contact-info__content">
                                    <span className="contact-info__address">66 Broklyant, New York India</span>
                                </div>
                            </div>
                            <div className="contact-info d-flex gap-3 align-items-center mb-2">
                                <span className="contact-info__icon text-gradient"><i className="fas fa-phone"></i></span>
                                <div className="contact-info__content">
                                    <span className="contact-info__address">012 345 678 9101</span>
                                </div>
                            </div>
                            <div className="contact-info d-flex gap-3 align-items-center mb-2">
                                <span className="contact-info__icon text-gradient"><i className="fas fa-envelope"></i></span>
                                <div className="contact-info__content">
                                    <span className="contact-info__address"> {userData.email} </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card common-card">
                <div className="card-body">
                    <form action="#">
                        <h6 className="loginRegister__title text-poppins">Get A Quote</h6>

                        <div className="row gy-lg-4 gy-3">
                            <div className="col-sm-6 col-xs-6">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input type="text" className="common-input" placeholder="Enter Your Name" id="name"/>
                            </div>
                            <div className="col-sm-6 col-xs-6">
                                <label htmlFor="Email" className="form-label">Email</label>
                                <input type="email" className="common-input" placeholder="Enter Your Email" id="Email"/>
                            </div>
                            <div className="col-sm-6 col-xs-6">
                                <label htmlFor="Phone" className="form-label">Phone</label>
                                <input type="tel" className="common-input" placeholder="Enter Your Phone" id="Phone"/>
                            </div>
                            <div className="col-sm-6 col-xs-6">
                                <label htmlFor="Phone" className="form-label">Type</label>
                                <div className="select-has-icon">
                                    <select className="form-select common-input text-gray-800">
                                        <option value="Type" disabled="" >Select Your Type</option>
                                        <option value="1">Property Management</option>
                                        <option value="1">Mortgage Server</option>
                                        <option value="1">Consulting Service</option>
                                        <option value="1">Home Buying</option>
                                        <option value="1">Home Selling</option>
                                        <option value="1">Escrow Service</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <label htmlFor="message" className="form-label">Message</label>
                                <textarea className="common-input" placeholder="Your Message" id="message"></textarea>
                            </div>
                            <div className="col-12">
                                <div className="common-check mb-0">
                                    <input className="form-check-input" type="checkbox" value="" id="remember"/>
                                    <label className="form-check-label" htmlFor="remember"> Save my name, email, and website in this browser for the next time I comment. </label>
                                </div>
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-main w-100">Get a free service</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AccountProfileTab;