import  { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import LoginRegisterThumb from '../../public/assets/images/thumbs/login-img.avif';
import url from '../url';

const LoginSection = () => {

    //  const navigate = useNavigate();
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
            const response = await axios.post(`${url.API_URL}/auth/login`, formData);
            const { token, user } = response.data;
            // Store token and user info in localStorage (or cookies)
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            toast.success('Login successful!');
            window.location.href = '/'; // Redirect to dashboard or home
        } catch (error) {
            console.error('Login error:', error);
            const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
        <ToastContainer/>
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
        </>
    );
};

export default LoginSection;




// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useFormik } from "formik";
// import * as yup from "yup";
// import { ToastContainer, toast } from 'react-toastify';

// import LoginRegisterThumb from '../../public/assets/images/thumbs/login-img.avif';

// const LoginSection = () => {

//     const [showPassword, setShowPassword] = useState(false);
//     const handleShowPassword = () => {
//         setShowPassword(!showPassword);
//     }

//     // Navigate to Account Page
//     const navigate = useNavigate(); 

//     // Form Validation Schema
//     const validationSchema = yup.object({
//         username: yup.string().min(3, "Too Short! Must be at least 3 characters long").required(),
//         email: yup.string().email("Your Email is not valid! Provide valid email").required(),
//         password: yup
//             .string()
//             .min(5, 'Password must be 5 characters long')
//             .matches(/[0-9]/, 'Password requires a number')
//             .matches(/[a-z]/, 'Password requires a lowercase letter')
//             .matches(/[A-Z]/, 'Password requires an uppercase letter')
//             .matches(/[^\w]/, 'Password requires a symbol')
//             .required('Password is required'),
//     });

//     // Formik Initialization
//     const formik = useFormik({
//         initialValues: {
//           username: "",
//           email: "",
//           password: "",
//         },
//         validationSchema: validationSchema,
//         onSubmit: (values, { resetForm }) => {
//             const { username, email, password } = values;
//             console.log(username);
//             console.log(email);
//             console.log(password);
            
//             navigate('/account');
//             resetForm();
//             toast.success("Congratulations! You Have Submitted Successfully.", {
//                 theme: "colored",
//             });
//             console.log('You Logged in Successfully');
//         },
//     });

//     return (
//         <>
//         <ToastContainer/>
//             <section className="loginRegister padding-y-120">
//                 <div className="container container-two">
//                     <div className="loginRegister-box card common-card">
//                         <div className="card-body">
//                             <div className="row gy-4">
//                                 <div className="col-lg-6">
//                                     <div className="loginRegister-thumb rounded overflow-hidden me-lg-2 d-flex h-100">
//                                         <img src={LoginRegisterThumb} alt=""/>
//                                     </div>
//                                 </div>
//                                 <div className="col-lg-6">
//                                     <div className="loginRegister-content">
//                                         <form onSubmit={formik.handleSubmit} method="POST">
//                                             <h3 className="loginRegister__title text-poppins">Login to CityScape</h3>
//                                             <p className="loginRegister__desc mb-4 font-18">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, corrupti.</p>

//                                             <div className="row gy-lg-4 gy-3">
//                                                 <div className="col-sm-6 col-xs-6">
//                                                     <label htmlFor="username" className="form-label">Username</label>
//                                                     <input 
//                                                         type="text" 
//                                                         placeholder="User Name"
//                                                         name='username'
//                                                         id='username'
//                                                         onChange={formik.handleChange}
//                                                         onBlur={formik.handleBlur}
//                                                         value={formik.values.username}
//                                                         className={`common-input ${
//                                                             formik.touched.username && formik.errors.username ? "is-invalid" : ""
//                                                         }`}
//                                                     />
//                                                     {formik.touched.username && formik.errors.username && (
//                                                         <span className="text-danger">{formik.errors.username}</span>
//                                                     )}
//                                                 </div>
//                                                 <div className="col-sm-6 col-xs-6">
//                                                     <label htmlFor="Email" className="form-label">Email</label>
//                                                     <input 
//                                                         type="email" 
//                                                         placeholder="Email"
//                                                         name='email'
//                                                         id='Email'
//                                                         onChange={formik.handleChange}
//                                                         onBlur={formik.handleBlur}
//                                                         value={formik.values.email}
//                                                         className={`common-input ${
//                                                             formik.touched.email && formik.errors.email ? "is-invalid" : ""
//                                                         }`}
//                                                     />
//                                                     {formik.touched.email && formik.errors.email && (
//                                                         <span className="text-danger">{formik.errors.email}</span>
//                                                     )}
//                                                 </div>
//                                                 <div className="col-sm-12">
//                                                     <label htmlFor="your-password" className="form-label">Password</label>
//                                                     <div className="position-relative">
//                                                         <input 
//                                                             type={`${showPassword ? 'text': 'password'}`}
//                                                             placeholder="Password"
//                                                             name='password'
//                                                             id='your-password'
//                                                             onChange={formik.handleChange}
//                                                             onBlur={formik.handleBlur}
//                                                             value={formik.values.password}
//                                                             className={`common-input ${
//                                                                 formik.touched.password && formik.errors.password ? "is-invalid" : ""
//                                                             }`}
//                                                         />
//                                                         <span className={`password-show-hide ${showPassword ? 'fas fa-eye ': 'fas fa-eye-slash'}`} onClick={handleShowPassword}> </span>
//                                                     </div>
//                                                     {formik.touched.password && formik.errors.password && (
//                                                         <span className="text-danger">{formik.errors.password}</span>
//                                                     )}
//                                                 </div>
//                                                 <div className="col-12">
//                                                     <button type="submit" className="btn btn-main w-100">Login <span className="icon-right"> <i className="far fa-paper-plane"></i> </span> </button>
//                                                 </div>
//                                                 <div className="col-sm-12 mb-0">
//                                                     <div className="have-account text-center">
//                                                         <p className="text">Don't Have An Account? <Link to="/register" className="link text-main text-decoration-underline font-14 text-poppins"> Register</Link></p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>   
//         </>
//     );
// };

// export default LoginSection;
