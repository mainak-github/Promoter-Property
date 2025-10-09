/* eslint-disable react-hooks/rules-of-hooks */


import { useEffect } from 'react';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';
import DashboardNavbar from '../common/Dashboard_Navbar';
import { Layout, Card, Typography, Row, Col, Form, Input, Button, Upload, message, Breadcrumb } from 'antd';
import { UserOutlined, FileTextOutlined, PhoneOutlined, MailOutlined, BankOutlined, IdcardOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
const { Content } = Layout;
const { Title } = Typography;

import { useForm } from 'react-hook-form';
import axios from 'axios'; 
import url from '../url';
const BrokerRegistration = () => {





  // prevent user if they are not logged in

  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
    return null; // Prevent rendering if not logged in
  }

  const admin = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    // eslint-disable-next-line no-unused-vars
    formState: { errors }
  } = useForm();

  useEffect(() => {
    const generateMemberId = (role = 'BROKER') => {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.random().toString(36).substr(2, 6).toUpperCase();
      return `${role}${date}MBR${random}`;
    };

    setValue('memberId', generateMemberId('BROKER')); // change 'BROKER' if needed
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append text fields
      for (const key in data) {
        if (key !== 'agreementFile' && key !== 'profilePhoto') {
          formData.append(key, data[key]);
        }
      }

      // Append files
      if (data.agreementFile?.[0]) {
        formData.append('agreementFile', data.agreementFile[0]);
      }

      if (data.profilePhoto?.[0]) {
        formData.append('profilePhoto', data.profilePhoto[0]);
      }

      // Send request
   await axios.post(`${url.API_URL}/admin/brokers`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });
      toast.success('Broker created successfully!');
      setInterval(() => {
        window.location.href = "/broker/registration"
      }, 4000);
      reset();
    } catch (error) {
      console.error('Failed to create broker:', error);
      toast.error('Error creating broker');
    }
  };


  return (
    <>
          <Layout style={{ minHeight: '100vh' }}>
      <DashboardSidebar2 />
      <Layout>
        <DashboardNavbar />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Breadcrumb style={{ marginBottom: 24 }} items={[{ title: 'Profile' }, { title: 'Register Broker' }]} />
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                <UserOutlined /> Broker Registration
              </Title>
            }
            style={{ maxWidth: 800, margin: '0 auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            <div className="col-lg-12">
                              <div className="loginRegister-content p-5">
                                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                                  <div className="mb-2">
                                    <label htmlFor="name">Full Name:</label>
                                    <input id="name" {...register('name', { required: true })} placeholder="Full Name" className="form-control" />
                                  </div>

                                  <div className="mb-2">
                                    <label htmlFor="email">Email:</label>
                                    <input id="email" {...register('email', { required: true })} placeholder="Email" type="email" className="form-control" />
                                  </div>

                                  <div className="mb-2">
                                    <label htmlFor="password">Password:</label>
                                    <input id="password" {...register('password', { required: true })} placeholder="Password" type="password" className="form-control" />
                                  </div>

                                  <div className="mb-2">
                                    <label htmlFor="mobileNumber">Mobile Number:</label>
                                    <input id="mobileNumber" {...register('mobileNumber')} placeholder="Mobile Number" className="form-control" />
                                  </div>

                                  <div className="mb-2">
                                    <label htmlFor="companyName">Company Name:</label>
                                    <input id="companyName" {...register('companyName')} placeholder="Company Name" className="form-control" />
                                  </div>

                                  <div className="mb-2">
                                    <label htmlFor="companyRegNo">Company Reg. No:</label>
                                    <input id="companyRegNo" {...register('companyRegNo')} placeholder="Company Reg. No" className="form-control" />
                                  </div>

                                  <div className="mb-2">
                                    <label htmlFor="gstId">GST ID:</label>
                                    <input id="gstId" {...register('gstId')} placeholder="GST ID" className="form-control" />
                                  </div>

                                  <div className="mb-2">
                                    <label htmlFor="brokerRegNo">Broker Reg. No:</label>
                                    <input id="brokerRegNo" {...register('brokerRegNo')} placeholder="Broker Reg. No" className="form-control" />
                                  </div>

                                  <div className="mb-2">
                                    <label htmlFor="address">Address:</label>
                                    <span>(Provide an address in proper format e.g `Post Office: Park Street, District: Kolkata, State: West Bengal, Pincode: 700016` other wise it will lead to verification failure)</span>
                                    <input id="address" {...register('address')} placeholder="Address" className="form-control" />
                                  </div>

                                  <div className="mb-2">
                                    <label htmlFor="memberId">Member ID: (This Is System Generated Unique ID Do not change it)</label>
                                    <input
                                      id="memberId"
                                      {...register('memberId')}
                                      className="form-control"
                                      readOnly
                                    />
                                  </div>

                                  <input type='hidden' {...register('created_by')} value={admin.name} />

                                  <div className="mb-2">
                                    <label htmlFor="agreementFile">Agreement File:</label>
                                    <input id="agreementFile" type="file" {...register('agreementFile')} className="form-control" />
                                  </div>

                                  <div className="mb-3">
                                    <label htmlFor="profilePhoto">Profile Photo:</label>
                                    <input id="profilePhoto" type="file" {...register('profilePhoto')} className="form-control" />
                                  </div>

                                  <button type="submit" className="btn btn-primary">Register</button>
                                </form>
                              </div>

                            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
    
    </>
  );
}

export default BrokerRegistration;
