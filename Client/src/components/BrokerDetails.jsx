/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';
import DashboardSidebar from '../common/Dashboard_Sidebar';
import DashboardNavbar from '../common/Dashboard_Navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import url from '../url';

    import { Layout, Card, Typography, Row, Col, Spin, Image, Tag, Breadcrumb, message, Button } from 'antd';

import {
  UserOutlined, PhoneOutlined, MailOutlined, BankOutlined,
  IdcardOutlined, EnvironmentOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, EyeOutlined
} from '@ant-design/icons';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';

const BrokerDetails = () => {
  // Always call hooks at the top level
  const { id: brokerId } = useParams();



  // prevent user if they are not logged in

  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
    return null; // Prevent rendering if not logged in
  }

  //fetch broker data from database
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);

      // console.log(`${url.API_URL}/admin/brokers/${brokerId}/broker`);
      
  
  const fetchBrokers = async () => {
    try {

      // const token = localStorage.getItem('token'); // or wherever you store it
      const response = await axios.get(`${url.API_URL}/admin/brokers/${brokerId}/broker`, {
        // headers: { Authorization: `Bearer ${token}` },
      });
      setBrokers(Array.isArray(response.data.broker) ? response.data.broker : [response.data.broker]);

    } catch (err) {
      console.error('Failed to fetch brokers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);


  return (
    <>

 <Layout style={{ minHeight: '100vh' }}>
       <DashboardSidebar /> 
      <Layout>
        <DashboardNavbar />
        <div className="container">
              <div className="row">
               <div className="col-md-12">
  {loading ? (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3">Loading broker details...</p>
    </div>
  ) : (
    <div className="container my-4">
      <h2 className="mb-5 text-center fw-bold" style={{ color: "#6e8efb" }}>
        🧑‍💼 Broker Profiles
      </h2>

      {brokers.length > 0 ? (
        brokers.map((broker, index) => (
          <div
            key={index}
            className="card shadow-lg border-0 rounded-5 mb-5 mx-auto"
            style={{
              maxWidth: "800px",
              background: "linear-gradient(135deg, #f3f4f6, #ffffff)",
              boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <img
                  src={`${url.IMAGE_URL}/${broker.profilePhoto}`}
                  alt="Profile"
                  className="rounded-circle me-4 shadow"
                  width="90"
                  height="90"
                  style={{
                    objectFit: "cover",
                    border: "3px solid #6e8efb",
                  }}
                />
                <div>
                  <h4 className="mb-1 text-dark">
                    <i className="fas fa-user-circle me-2 text-primary"></i>
                    {broker.fullName}
                  </h4>
                  <p className="text-muted mb-0">
                    <i className="fas fa-phone-alt me-2 text-success"></i>
                    {broker.mobileNumber}
                  </p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="bg-light rounded-4 p-3">
                    <i className="fas fa-building me-2"></i>
                    <strong>Company:</strong> {broker.companyName}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light rounded-4 p-3">
                    <i className="fas fa-id-badge me-2"></i>
                    <strong>Reg No:</strong> {broker.companyRegNo}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light rounded-4 p-3">
                    <i className="fas fa-file-invoice me-2"></i>
                    <strong>GST ID:</strong> {broker.gstId}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light rounded-4 p-3">
                    <i className="fas fa-id-card me-2"></i>
                    <strong>Member ID:</strong> {broker.memberId}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="bg-light rounded-4 p-3">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    <strong>Address:</strong> {broker.address}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="bg-light rounded-4 p-3 d-flex align-items-center">
                    {broker.approval_status === "approved" && (
                      <span className="badge bg-success px-3 py-2 fs-6 rounded-pill shadow-sm">
                        <i className="fas fa-check-circle me-2"></i>Approved
                      </span>
                    )}
                    {broker.approval_status === "pending" && (
                      <span className="badge bg-warning text-dark px-3 py-2 fs-6 rounded-pill shadow-sm">
                        <i className="fas fa-hourglass-half me-2"></i>Pending
                      </span>
                    )}
                    {broker.approval_status === "rejected" && (
                      <span className="badge bg-danger px-3 py-2 fs-6 rounded-pill shadow-sm">
                        <i className="fas fa-times-circle me-2"></i>Rejected
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-md-12 mt-3">
                  <div className="bg-light rounded-4 p-3">
                    <i className="fas fa-file-pdf me-2 text-danger"></i>
                    <strong>Agreement File:</strong>
                    <a
                      href={`${import.meta.env.VITE_IMAGE_URL}/${broker.agreementFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-danger ms-3 btn-sm rounded-pill text-dark"
                    >
                      <i className="fas fa-eye me-1"></i> View PDF
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted">No broker data available.</p>
      )}
    </div>
  )}
</div>

              </div>
            </div>
      </Layout>
    </Layout>

    </>
  );
}

export default BrokerDetails;
