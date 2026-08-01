import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import LoginRegisterThumb from '../../public/assets/images/thumbs/login-img.avif';
import url from '../url';

const LoginRegister = () => {


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const [message] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
             await axios.post(`${url.API_URL}/auth/register`, formData); // Adjust endpoint if needed
            toast.success('Registration successful!');
            setFormData({ name: '', email: '', password: '', role: '' }); 
        } catch (error) {
            console.error('Error creating user:', error);
            const msg = error.response?.data?.message || 'Failed to create user.';
            toast.error(msg);
        }
    };

    return (
        <>
            <ToastContainer />
            <section className="loginRegister padding-y-120">
                <div className="container container-two">
                    <div className="loginRegister-box card common-card">
                        <div className="card-body">
                            <div className="row gy-4">
                                <div className="col-lg-6">
                                    <div className="loginRegister-thumb rounded overflow-hidden me-lg-2 d-flex h-100">
                                        <img src={LoginRegisterThumb} alt="" />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="loginRegister-content p-5">
                                        {message && <div className="alert alert-info">{message}</div>}
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label>Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                             <div className="mb-3">
                                                <label>Role</label>
                                                <select className='form-control' name="role" id="role" value={formData.role} onChange={handleChange}>
                                                    <option value="client">Client</option>

                                                    <option value="broker">Broker</option>
                                                </select>
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <button type="submit" className="btn btn-primary">Create User</button>
                                            </div>
                                        </form>
                                       <div className="d-flex justify-content-center">
                                         <p>Already Have Account ? <Link to="/login">Login here</Link></p>
                                       </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LoginRegister;