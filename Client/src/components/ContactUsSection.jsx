import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import url from '../url';

const ContactUsSection = () => {
    const form = useRef();
    const [submitting, setSubmitting] = useState(false);
    const [properties, setProperties] = useState([]);
    const [loadingProperties, setLoadingProperties] = useState(true);

    // Fetch properties for dropdown
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`${url.API_URL}/public/properties`, {
                    params: {
                        page: 1,
                        limit: 100, // Get enough properties for dropdown
                        status: 'approved'
                    }
                });
                
                if (response.data.status === "success") {
                    setProperties(response.data.data.properties);
                }
            } catch (error) {
                console.error('Error fetching properties:', error);
                toast.error("Failed to load properties", {
                    theme: "colored",
                });
            } finally {
                setLoadingProperties(false);
            }
        };

        fetchProperties();
    }, []);

    const sendEmail = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Get form data
        const formData = new FormData(form.current);
        const data = {
            name: formData.get('user_name'),
            email: formData.get('user_email'),
            phone: formData.get('user_phone'),
            subject: formData.get('user_subject'),
            message: formData.get('message'),
            propertyId: formData.get('property_id'), // Add propertyId
            leadType: 'contact_us'
        };

        // Validate required fields
        if (!data.name || !data.email || !data.phone || !data.message) {
            toast.error("Please fill in all required fields.", {
                theme: "colored",
            });
            setSubmitting(false);
            return;
        }

        // Validate propertyId
        if (!data.propertyId) {
            toast.error("Please select a property you're interested in.", {
                theme: "colored",
            });
            setSubmitting(false);
            return;
        }

        try {
            await axios.post(`${url.API_URL}/admin/leads`, data);
            
            form.current.reset();
            toast.success("Congratulations! You Have Submitted Successfully.", {
                theme: "colored",
            });
            console.log('SUCCESS!');
        } catch (error) {
            toast.error("Something went wrong! Your message didn't sent.", {
                theme: "colored",
            });
            console.log('FAILED...', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Format price for display
    const formatPriceToIndian = (priceString) => {
        if (!priceString) return '';
        
        const cleanPrice = priceString.toString().toLowerCase().trim();
        const priceMatch = cleanPrice.match(/(\d+(?:\.\d+)?)\s*(cr|crore|l|lakh|k|thousand)?/);
        
        if (!priceMatch) return priceString;
        
        const [, numberStr, unit] = priceMatch;
        const number = parseFloat(numberStr);
        
        if (isNaN(number)) return priceString;
        
        if (unit) {
            switch (unit) {
                case 'cr':
                case 'crore':
                    return number >= 10 ? `₹${Math.round(number)} Cr` : `₹${number.toFixed(1)} Cr`;
                case 'l':
                case 'lakh':
                    return `₹${number} L`;
                case 'k':
                case 'thousand':
                    return `₹${number}K`;
                default:
                    return `₹${new Intl.NumberFormat('en-IN').format(number)}`;
            }
        }
        
        return number >= 100 ? `₹${number} Cr` : `₹${number} L`;
    };
    
    return (
        <>
            <ToastContainer/>
            <section className="contact-us-section padding-b-120">
                <div className="container container-two">
                    <div className="contact-form bg-white">  
                        <div className="section-heading">
                            <span className="section-heading__subtitle bg-gray-100"> 
                                <span className="text-gradient fw-semibold">Contact us</span> 
                            </span>
                            <h2 className="section-heading__title">Do you have any question? </h2>
                            <p className="section-heading__desc">Get in touch with us for any property inquiries, site visits, or investment guidance. Our expert team is here to help you find your perfect property.</p>
                        </div>
                        <div className="contact-form__form">
                            <form ref={form} onSubmit={sendEmail} className="contact-form__form">
                                <div className="row gy-4">
                                    <div className="col-sm-6 col-xs-6">
                                        <input 
                                            type="text" 
                                            className="common-input" 
                                            name='user_name' 
                                            placeholder="Your Name *"
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xs-6">
                                        <input 
                                            type="email" 
                                            className="common-input" 
                                            name='user_email' 
                                            placeholder="Your E-mail *"
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xs-6">
                                        <input 
                                            type="tel" 
                                            className="common-input" 
                                            name='user_phone' 
                                            placeholder="Phone Number *"
                                            required
                                            pattern="[0-9]{10,15}"
                                            title="Please enter a valid phone number (10-15 digits)"
                                        />
                                    </div>
                                    <div className="col-sm-6 col-xs-6">
                                        <input 
                                            type="text" 
                                            className="common-input" 
                                            name='user_subject' 
                                            placeholder="Subject"
                                        />
                                    </div>
                                    
                                    {/* Property Selection Dropdown */}
                                    <div className="col-12">
                                        <select 
                                            className="common-input" 
                                            name="property_id"
                                            required
                                            style={{
                                                appearance: 'none',
                                                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 12px center',
                                                backgroundSize: '16px',
                                                paddingRight: '40px'
                                            }}
                                        >
                                            <option value="">
                                                {loadingProperties ? 'Loading properties...' : 'Select Property of Interest *'}
                                            </option>
                                            {!loadingProperties && properties.map((property) => (
                                                <option key={property.id} value={property.id}>
                                                    {property.title} - {formatPriceToIndian(property.priceRange)} 
                                                    {property.city && ` in ${property.city}`}
                                                    {property.bedrooms && ` (${property.bedrooms} BHK)`}
                                                </option>
                                            ))}
                                            <option value="general">General Inquiry</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <textarea 
                                            className="common-input" 
                                            name='message' 
                                            placeholder="Your Message *"
                                            required
                                            rows="5"
                                        ></textarea>
                                    </div>
                                    <div className="col-12">
                                        <button 
                                            type="submit" 
                                            className="btn btn-main w-100"
                                            disabled={submitting || loadingProperties}
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Now'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>  
                    </div>
                </div>  
            </section>

            {/* Add some custom CSS for the dropdown */}
            <style>{`
                .common-input:focus {
                    outline: none;
                    border-color: #007bff;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }
                
                .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                }
                
                @media (max-width: 576px) {
                    .col-xs-6 {
                        flex: 0 0 100%;
                        max-width: 100%;
                    }
                }
            `}</style>
        </>
    );
};

export default ContactUsSection;
