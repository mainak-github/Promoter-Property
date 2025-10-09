
import  { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {  toast } from 'react-toastify';
import LoginRegisterThumb from '../../public/assets/images/thumbs/login-img.avif';
import apiurl from '../url'
const AdminLogin = () => {
    

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${apiurl.API_URL}/auth/login`, formData);
            const { token, user } = response.data;
            // Store token and user info in localStorage (or cookies)
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            toast.success('Login successful!');
            window.location.href = '/admin/dashboard'; // Redirect to dashboard or home
        } catch (error) {
            console.error('Login error:', error);
            const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <section className="loginRegister padding-y-120">
                            <div className="container container-two">
                                <div className="loginRegister-box card common-card">
                                    <div className="card-body">
                                        <div className="row gy-4">
                                            <div className="col-lg-6">
                                                <div className="loginRegister-thumb rounded overflow-hidden me-lg-2 d-flex h-100">
                                                    <img src={LoginRegisterThumb} alt=""/>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 p-5">
                                                <div className="loginRegister-content">
                                                    <form onSubmit={handleSubmit}>
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
            
                                                        <div className="d-flex justify-content-center">
                                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                            {loading ? 'Logging in...' : 'Login'}
                                                        </button>
                                                        </div>
                                                    </form>
            
                                                <div className="d-flex justify-content-center">
                                                     <p>Do not have an account? <Link to="/register">Register here</Link></p>
                                                   </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
        </div>
    );
}

export default AdminLogin;
