/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */


import { useEffect } from 'react';
import DashboardSidebar2 from '../common/Dashboard_Sidebar2';
import DashboardNavbar from '../common/Dashboard_Navbar';
import { toast, ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import axios from 'axios'; 
import { useParams } from 'react-router-dom';
import url from '../url';
const BorkerUpdate = () => {
const { id } = useParams();




  // prevent user if they are not logged in

  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
    return null; // Prevent rendering if not logged in
  }

  // const admin = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

 const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  // Fetch existing broker data
  useEffect(() => {
    const fetchBroker = async () => {
      try {
        const response = await axios.get(`${url.API_URL}/admin/brokers/${id}/broker`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const broker = response.data.broker;

        // Populate form fields
        for (const key in broker) {
          if (broker[key] && key !== 'agreementFile' && key !== 'profilePhoto') {
            setValue(key, broker[key]);
          }
        }
      } catch (error) {
        toast.error('Failed to fetch broker data.');
        console.error(error);
      }
    };

    fetchBroker();
  }, [id, setValue, token]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        if (key !== 'agreementFile' && key !== 'profilePhoto') {
          formData.append(key, data[key]);
        }
      }

      if (data.agreementFile?.[0]) {
        formData.append('agreementFile', data.agreementFile[0]);
      }

      if (data.profilePhoto?.[0]) {
        formData.append('profilePhoto', data.profilePhoto[0]);
      }

      const response = await axios.put(
        `${url.API_URL}/admin/brokers/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Broker updated successfully!');
    //   setTimeout(() => {
    //     window.location.href = "/admin/brokers";
    //   }, 3000);
    } catch (error) {
      toast.error('Failed to update broker.');
      console.error(error);
    }
  };


  return (
    <>
 
      {/* Begin page */}
      <div className="wrapper">
        {/* ========== Topbar Start ========== */}
        <DashboardNavbar />
        {/* ========== Topbar End ========== */}
        {/* ========== Left Sidebar Start ========== */}
        <DashboardSidebar2 />
        {/* ========== Left Sidebar End ========== */}
        {/* ============================================================== */}
        {/* Start Page Content Here */}
        {/* ============================================================== */}
        <div className="content-page">
          <div className="content">
            {/* Start Content*/}
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box">
                    <div className="page-title-right">
                      <form className="d-flex">
                        <div className="input-group">
                          <input type="text" className="form-control form-control-light" id="dash-daterange" />
                          <span className="input-group-text bg-primary border-primary text-white">
                            <i className="mdi mdi-calendar-range font-13" />
                          </span>
                        </div>
                        <a href="javascript: void(0);" className="btn btn-primary ms-2">
                          <i className="mdi mdi-autorenew" />
                        </a>
                        <a href="javascript: void(0);" className="btn btn-primary ms-1">
                          <i className="mdi mdi-filter-variant" />
                        </a>
                      </form>
                    </div>
                    <h4 className="page-title">Dashboard</h4>
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <ToastContainer />
                  <section className="loginRegister padding-y-120">
                    <div className="container container-two">
                      <div className="loginRegister-box card common-card">
                        <div className="card-body">
                          <div className="row gy-4">

                           <div className="col-lg-12">
      <ToastContainer />
      <div className="loginRegister-content p-5">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <h4 className="mb-4">Update Broker</h4>

          <div className="mb-2">
            <label>Full Name:</label>
            <input {...register('fullName', { required: true })} className="form-control" />
          </div>


          <div className="mb-2">
            <label>Mobile Number:</label>
            <input {...register('mobileNumber')} className="form-control" />
          </div>

          <div className="mb-2">
            <label>Company Name:</label>
            <input {...register('companyName')} className="form-control" />
          </div>

          <div className="mb-2">
            <label>Company Reg. No:</label>
            <input {...register('companyRegNo')} className="form-control" />
          </div>

          <div className="mb-2">
            <label>GST ID:</label>
            <input {...register('gstId')} className="form-control" />
          </div>

          <div className="mb-2">
            <label>Broker Reg. No:</label>
            <input {...register('brokerRegNo')} className="form-control" />
          </div>

          <div className="mb-2">
            <label>Address:</label>
            <input {...register('address')} className="form-control" />
          </div>

          <div className="mb-2">
            <label>Member ID (read-only):</label>
            <input {...register('memberId')} className="form-control" readOnly />
          </div>

          <div className="mb-2">
            <label>Agreement File:</label>
            <input type="file" {...register('agreementFile')} className="form-control" />
          </div>

          <div className="mb-2">
            <label>Profile Photo:</label>
            <input type="file" {...register('profilePhoto')} className="form-control" />
          </div>

          <button type="submit" className="btn btn-success mt-3">Update Broker</button>
        </form>
      </div>
    </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>




              {/* container */}
            </div>
            {/* content */}
            {/* Footer Start */}
            <footer className="footer">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    © Hyper - Coderthemes.com
                  </div>
                  <div className="col-md-6">
                    <div className="text-md-end footer-links d-none d-md-block">
                      <a href="javascript: void(0);">About</a>
                      <a href="javascript: void(0);">Support</a>
                      <a href="javascript: void(0);">Contact Us</a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
            {/* end Footer */}
          </div>
          {/* ============================================================== */}
          {/* End Page content */}
          {/* ============================================================== */}
        </div>
        {/* END wrapper */}
        {/* Theme Settings */}
        <div className="offcanvas offcanvas-end" tabIndex={-1} id="theme-settings-offcanvas">
          <div className="d-flex align-items-center bg-primary p-3 offcanvas-header">
            <h5 className="text-white m-0">Theme Settings</h5>
            <button type="button" className="btn-close btn-close-white ms-auto" data-bs-dismiss="offcanvas" aria-label="Close" />
          </div>
          <div className="offcanvas-body p-0">
            <div data-simplebar className="h-100">
              <div className="card mb-0 p-3">
                <h5 className="mt-0 font-16 fw-bold mb-3">Choose Layout</h5>
                <div className="row">
                  <div className="col-4">
                    <div className="form-check card-radio">
                      <input id="customizer-layout01" name="data-layout" type="radio" defaultValue="vertical" className="form-check-input" />
                      <label className="form-check-label p-0 avatar-md w-100" htmlFor="customizer-layout01">
                        <span className="d-flex h-100">
                          <span className="flex-shrink-0">
                            <span className="bg-light d-flex h-100 border-end flex-column p-1 px-2">
                              <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                            </span>
                          </span>
                          <span className="flex-grow-1">
                            <span className="d-flex h-100 flex-column">
                              <span className="bg-light d-block p-1" />
                            </span>
                          </span>
                        </span>
                      </label>
                    </div>
                    <h5 className="font-14 text-center text-muted mt-2">Vertical</h5>
                  </div>
                  <div className="col-4">
                    <div className="form-check card-radio">
                      <input id="customizer-layout02" name="data-layout" type="radio" defaultValue="horizontal" className="form-check-input" />
                      <label className="form-check-label p-0 avatar-md w-100" htmlFor="customizer-layout02">
                        <span className="d-flex h-100 flex-column">
                          <span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
                            <span className="d-block p-1 bg-dark-lighten rounded me-1" />
                            <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto" />
                            <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                            <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                            <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                          </span>
                          <span className="bg-light d-block p-1" />
                        </span>
                      </label>
                    </div>
                    <h5 className="font-14 text-center text-muted mt-2">Horizontal</h5>
                  </div>
                </div>
                <h5 className="my-3 font-16 fw-bold">Color Scheme</h5>
                <div className="colorscheme-cardradio">
                  <div className="row">
                    <div className="col-4">
                      <div className="form-check card-radio">
                        <input className="form-check-input" type="radio" name="data-bs-theme" id="layout-color-light" defaultValue="light" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="layout-color-light">
                          <div id="sidebar-size">
                            <span className="d-flex h-100">
                              <span className="flex-shrink-0">
                                <span className="bg-light d-flex h-100 border-end flex-column p-1 px-2">
                                  <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                </span>
                              </span>
                              <span className="flex-grow-1">
                                <span className="d-flex h-100 flex-column bg-white rounded-2">
                                  <span className="bg-light d-block p-1" />
                                </span>
                              </span>
                            </span>
                          </div>
                          <div id="topnav-color" className="bg-white rounded-2 h-100">
                            <span className="d-flex h-100 flex-column">
                              <span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
                                <span className="d-block p-1 bg-dark-lighten rounded me-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                              </span>
                              <span className="d-flex h-100 flex-column bg-white rounded-2">
                                <span className="bg-light d-block p-1" />
                              </span>
                            </span>
                          </div>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Light</h5>
                    </div>
                    <div className="col-4">
                      <div className="form-check card-radio">
                        <input className="form-check-input" type="radio" name="data-bs-theme" id="layout-color-dark" defaultValue="dark" />
                        <label className="form-check-label p-0 avatar-md w-100 bg-black" htmlFor="layout-color-dark">
                          <div id="sidebar-size">
                            <span className="d-flex h-100">
                              <span className="flex-shrink-0">
                                <span className="bg-light d-flex h-100 flex-column p-1 px-2">
                                  <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                  <span className="d-block border border-secondary border-opacity-25 border-3 rounded w-100 mb-1" />
                                  <span className="d-block border border-secondary border-opacity-25 border-3 rounded w-100 mb-1" />
                                  <span className="d-block border border-secondary border-opacity-25 border-3 rounded w-100 mb-1" />
                                  <span className="d-block border border-secondary border-opacity-25 border-3 rounded w-100 mb-1" />
                                </span>
                              </span>
                              <span className="flex-grow-1">
                                <span className="d-flex h-100 flex-column">
                                  <span className="bg-light d-block p-1" />
                                </span>
                              </span>
                            </span>
                          </div>
                          <div id="topnav-color">
                            <span className="d-flex h-100 flex-column">
                              <span className="bg-light-lighten d-flex p-1 align-items-center border-bottom border-opacity-25 border-primary border-opacity-25">
                                <span className="d-block p-1 bg-dark-lighten rounded me-1" />
                                <span className="d-block border border-primary border-opacity-25 border-3 rounded ms-auto" />
                                <span className="d-block border border-primary border-opacity-25 border-3 rounded ms-1" />
                                <span className="d-block border border-primary border-opacity-25 border-3 rounded ms-1" />
                                <span className="d-block border border-primary border-opacity-25 border-3 rounded ms-1" />
                              </span>
                              <span className="bg-light-lighten d-block p-1" />
                            </span>
                          </div>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Dark</h5>
                    </div>
                  </div>
                </div>
                <div id="layout-width">
                  <h5 className="my-3 font-16 fw-bold">Layout Mode</h5>
                  <div className="row">
                    <div className="col-4">
                      <div className="form-check card-radio">
                        <input className="form-check-input" type="radio" name="data-layout-mode" id="layout-mode-fluid" defaultValue="fluid" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="layout-mode-fluid">
                          <div id="sidebar-size">
                            <span className="d-flex h-100">
                              <span className="flex-shrink-0">
                                <span className="bg-light d-flex h-100 border-end flex-column p-1 px-2">
                                  <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                </span>
                              </span>
                              <span className="flex-grow-1">
                                <span className="d-flex h-100 flex-column rounded-2">
                                  <span className="bg-light d-block p-1" />
                                </span>
                              </span>
                            </span>
                          </div>
                          <div id="topnav-color">
                            <span className="d-flex h-100 flex-column">
                              <span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
                                <span className="d-block p-1 bg-dark-lighten rounded me-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                              </span>
                              <span className="bg-light d-block p-1" />
                            </span>
                          </div>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Fluid</h5>
                    </div>
                    <div className="col-4" id="layout-boxed">
                      <div className="form-check card-radio">
                        <input className="form-check-input" type="radio" name="data-layout-mode" id="layout-mode-boxed" defaultValue="boxed" />
                        <label className="form-check-label p-0 avatar-md w-100 px-2" htmlFor="layout-mode-boxed">
                          <div id="sidebar-size" className="border-start border-end">
                            <span className="d-flex h-100">
                              <span className="flex-shrink-0">
                                <span className="bg-light d-flex h-100 border-end flex-column p-1 px-2">
                                  <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                </span>
                              </span>
                              <span className="flex-grow-1">
                                <span className="d-flex h-100 flex-column rounded-2">
                                  <span className="bg-light d-block p-1" />
                                </span>
                              </span>
                            </span>
                          </div>
                          <div id="topnav-color" className="border-start border-end h-100">
                            <span className="d-flex h-100 flex-column">
                              <span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
                                <span className="d-block p-1 bg-dark-lighten rounded me-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                              </span>
                              <span className="bg-light d-block p-1" />
                            </span>
                          </div>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Boxed</h5>
                    </div>
                    <div className="col-4" id="layout-detached">
                      <div className="form-check sidebar-setting card-radio">
                        <input className="form-check-input" type="radio" name="data-layout-mode" id="data-layout-detached" defaultValue="detached" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="data-layout-detached">
                          <span className="d-flex h-100 flex-column">
                            <span className="bg-light d-flex p-1 align-items-center border-bottom ">
                              <span className="d-block p-1 bg-dark-lighten rounded me-1" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                            </span>
                            <span className="d-flex h-100 p-1 px-2">
                              <span className="flex-shrink-0">
                                <span className="bg-light d-flex h-100 flex-column p-1 px-2">
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100" />
                                </span>
                              </span>
                            </span>
                            <span className="bg-light d-block p-1 mt-auto px-2" />
                          </span>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Detached</h5>
                    </div>
                  </div>
                </div>
                <h5 className="my-3 font-16 fw-bold">Topbar Color</h5>
                <div className="row">
                  <div className="col-4">
                    <div className="form-check card-radio">
                      <input className="form-check-input" type="radio" name="data-topbar-color" id="topbar-color-light" defaultValue="light" />
                      <label className="form-check-label p-0 avatar-md w-100" htmlFor="topbar-color-light">
                        <div id="sidebar-size">
                          <span className="d-flex h-100">
                            <span className="flex-shrink-0">
                              <span className="bg-light d-flex h-100 border-end  flex-column p-1 px-2">
                                <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                              </span>
                            </span>
                            <span className="flex-grow-1">
                              <span className="d-flex h-100 flex-column">
                                <span className="bg-light d-block p-1" />
                              </span>
                            </span>
                          </span>
                        </div>
                        <div id="topnav-color">
                          <span className="d-flex h-100 flex-column">
                            <span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
                              <span className="d-block p-1 bg-dark-lighten rounded me-1" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                              <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                            </span>
                            <span className="bg-light d-block p-1" />
                          </span>
                        </div>
                      </label>
                    </div>
                    <h5 className="font-14 text-center text-muted mt-2">Light</h5>
                  </div>
                  <div className="col-4">
                    <div className="form-check card-radio">
                      <input className="form-check-input" type="radio" name="data-topbar-color" id="topbar-color-dark" defaultValue="dark" />
                      <label className="form-check-label p-0 avatar-md w-100" htmlFor="topbar-color-dark">
                        <div id="sidebar-size">
                          <span className="d-flex h-100">
                            <span className="flex-shrink-0">
                              <span className="bg-light d-flex h-100 border-end  flex-column p-1 px-2">
                                <span className="d-block p-1 bg-primary-lighten rounded mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                              </span>
                            </span>
                            <span className="flex-grow-1">
                              <span className="d-flex h-100 flex-column">
                                <span className="bg-dark d-block p-1" />
                              </span>
                            </span>
                          </span>
                        </div>
                        <div id="topnav-color">
                          <span className="d-flex h-100 flex-column">
                            <span className="bg-dark d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
                              <span className="d-block p-1 bg-primary-lighten rounded me-1" />
                              <span className="d-block border border-primary border-opacity-25 border-3 rounded ms-auto" />
                              <span className="d-block border border-primary border-opacity-25 border-3 rounded ms-1" />
                              <span className="d-block border border-primary border-opacity-25 border-3 rounded ms-1" />
                              <span className="d-block border border-primary border-opacity-25 border-3 rounded ms-1" />
                            </span>
                            <span className="bg-light d-block p-1" />
                          </span>
                        </div>
                      </label>
                    </div>
                    <h5 className="font-14 text-center text-muted mt-2">Dark</h5>
                  </div>
                  <div className="col-4">
                    <div className="form-check card-radio">
                      <input className="form-check-input" type="radio" name="data-topbar-color" id="topbar-color-brand" defaultValue="brand" />
                      <label className="form-check-label p-0 avatar-md w-100" htmlFor="topbar-color-brand">
                        <div id="sidebar-size">
                          <span className="d-flex h-100">
                            <span className="flex-shrink-0">
                              <span className="bg-light d-flex h-100 border-end  flex-column p-1 px-2">
                                <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                              </span>
                            </span>
                            <span className="flex-grow-1">
                              <span className="d-flex h-100 flex-column">
                                <span className="bg-primary bg-gradient d-block p-1" />
                              </span>
                            </span>
                          </span>
                        </div>
                        <div id="topnav-color">
                          <span className="d-flex h-100 flex-column">
                            <span className="bg-primary bg-gradient d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
                              <span className="d-block p-1 bg-light opacity-25 rounded me-1" />
                              <span className="d-block border border-3 border opacity-25 rounded ms-auto" />
                              <span className="d-block border border-3 border opacity-25 rounded ms-1" />
                              <span className="d-block border border-3 border opacity-25 rounded ms-1" />
                              <span className="d-block border border-3 border opacity-25 rounded ms-1" />
                            </span>
                            <span className="bg-light d-block p-1" />
                          </span>
                        </div>
                      </label>
                    </div>
                    <h5 className="font-14 text-center text-muted mt-2">Brand</h5>
                  </div>
                </div>
                <div>
                  <h5 className="my-3 font-16 fw-bold">Menu Color</h5>
                  <div className="row">
                    <div className="col-4">
                      <div className="form-check sidebar-setting card-radio">
                        <input className="form-check-input" type="radio" name="data-menu-color" id="leftbar-color-light" defaultValue="light" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="leftbar-color-light">
                          <div id="sidebar-size">
                            <span className="d-flex h-100">
                              <span className="flex-shrink-0">
                                <span className="bg-light d-flex h-100 border-end  flex-column p-1 px-2">
                                  <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                  <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                </span>
                              </span>
                              <span className="flex-grow-1">
                                <span className="d-flex h-100 flex-column">
                                  <span className="bg-light d-block p-1" />
                                </span>
                              </span>
                            </span>
                          </div>
                          <div id="topnav-color">
                            <span className="d-flex h-100 flex-column">
                              <span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-opacity-25">
                                <span className="d-block p-1 bg-dark-lighten rounded me-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                              </span>
                              <span className="bg-light d-block p-1" />
                            </span>
                          </div>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Light</h5>
                    </div>
                    <div className="col-4" >
                      <div className="form-check sidebar-setting card-radio">
                        <input className="form-check-input" type="radio" name="data-menu-color" id="leftbar-color-dark" defaultValue="dark" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="leftbar-color-dark">
                          <div id="sidebar-size">
                            <span className="d-flex h-100">
                              <span className="flex-shrink-0">
                                <span className="bg-dark d-flex h-100 flex-column p-1 px-2">
                                  <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                  <span className="d-block border border-secondary rounded border-opacity-25 border-3 w-100 mb-1" />
                                  <span className="d-block border border-secondary rounded border-opacity-25 border-3 w-100 mb-1" />
                                  <span className="d-block border border-secondary rounded border-opacity-25 border-3 w-100 mb-1" />
                                  <span className="d-block border border-secondary rounded border-opacity-25 border-3 w-100 mb-1" />
                                </span>
                              </span>
                              <span className="flex-grow-1">
                                <span className="d-flex h-100 flex-column">
                                  <span className="bg-light d-block p-1" />
                                </span>
                              </span>
                            </span>
                          </div>
                          <div id="topnav-color">
                            <span className="d-flex h-100 flex-column">
                              <span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary border-primary border-opacity-25">
                                <span className="d-block p-1 bg-primary-lighten rounded me-1" />
                                <span className="d-block border border-secondary rounded border-opacity-25 border-3 ms-auto" />
                                <span className="d-block border border-secondary rounded border-opacity-25 border-3 ms-1" />
                                <span className="d-block border border-secondary rounded border-opacity-25 border-3 ms-1" />
                                <span className="d-block border border-secondary rounded border-opacity-25 border-3 ms-1" />
                              </span>
                              <span className="bg-dark d-block p-1" />
                            </span>
                          </div>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Dark</h5>
                    </div>
                    <div className="col-4">
                      <div className="form-check sidebar-setting card-radio">
                        <input className="form-check-input" type="radio" name="data-menu-color" id="leftbar-color-brand" defaultValue="brand" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="leftbar-color-brand">
                          <div id="sidebar-size">
                            <span className="d-flex h-100">
                              <span className="flex-shrink-0">
                                <span className="bg-primary bg-gradient d-flex h-100 flex-column p-1 px-2">
                                  <span className="d-block p-1 bg-light-lighten rounded mb-1" />
                                  <span className="d-block border opacity-25 rounded border-3 w-100 mb-1" />
                                  <span className="d-block border opacity-25 rounded border-3 w-100 mb-1" />
                                  <span className="d-block border opacity-25 rounded border-3 w-100 mb-1" />
                                  <span className="d-block border opacity-25 rounded border-3 w-100 mb-1" />
                                </span>
                              </span>
                              <span className="flex-grow-1">
                                <span className="d-flex h-100 flex-column">
                                  <span className="bg-light d-block p-1" />
                                </span>
                              </span>
                            </span>
                          </div>
                          <div id="topnav-color">
                            <span className="d-flex h-100 flex-column">
                              <span className="bg-light d-flex p-1 align-items-center border-bottom border-secondary">
                                <span className="d-block p-1 bg-dark-lighten rounded me-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-auto" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded ms-1" />
                              </span>
                              <span className="bg-primary bg-gradient d-block p-1" />
                            </span>
                          </div>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Brand</h5>
                    </div>
                  </div>
                </div>
                <div id="sidebar-size">
                  <h5 className="my-3 font-16 fw-bold">Sidebar Size</h5>
                  <div className="row">
                    <div className="col-4">
                      <div className="form-check sidebar-setting card-radio">
                        <input className="form-check-input" type="radio" name="data-sidenav-size" id="leftbar-size-default" defaultValue="default" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="leftbar-size-default">
                          <span className="d-flex h-100">
                            <span className="flex-shrink-0">
                              <span className="bg-light d-flex h-100 border-end  flex-column p-1 px-2">
                                <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                              </span>
                            </span>
                            <span className="flex-grow-1">
                              <span className="d-flex h-100 flex-column">
                                <span className="bg-light d-block p-1" />
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Default</h5>
                    </div>
                    <div className="col-4">
                      <div className="form-check sidebar-setting card-radio">
                        <input className="form-check-input" type="radio" name="data-sidenav-size" id="leftbar-size-compact" defaultValue="compact" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="leftbar-size-compact">
                          <span className="d-flex h-100">
                            <span className="flex-shrink-0">
                              <span className="bg-light d-flex h-100 border-end  flex-column p-1">
                                <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                              </span>
                            </span>
                            <span className="flex-grow-1">
                              <span className="d-flex h-100 flex-column">
                                <span className="bg-light d-block p-1" />
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Compact</h5>
                    </div>
                    <div className="col-4">
                      <div className="form-check sidebar-setting card-radio">
                        <input className="form-check-input" type="radio" name="data-sidenav-size" id="leftbar-size-small" defaultValue="condensed" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="leftbar-size-small">
                          <span className="d-flex h-100">
                            <span className="flex-shrink-0">
                              <span className="bg-light d-flex h-100 border-end flex-column" style={{ padding: 2 }}>
                                <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                              </span>
                            </span>
                            <span className="flex-grow-1">
                              <span className="d-flex h-100 flex-column">
                                <span className="bg-light d-block p-1" />
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Condensed</h5>
                    </div>
                    <div className="col-4">
                      <div className="form-check sidebar-setting card-radio">
                        <input className="form-check-input" type="radio" name="data-sidenav-size" id="leftbar-size-small-hover" defaultValue="sm-hover" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="leftbar-size-small-hover">
                          <span className="d-flex h-100">
                            <span className="flex-shrink-0">
                              <span className="bg-light d-flex h-100 border-end flex-column" style={{ padding: 2 }}>
                                <span className="d-block p-1 bg-dark-lighten rounded mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                                <span className="d-block border border-3 border-secondary border-opacity-25 rounded w-100 mb-1" />
                              </span>
                            </span>
                            <span className="flex-grow-1">
                              <span className="d-flex h-100 flex-column">
                                <span className="bg-light d-block p-1" />
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Hover View</h5>
                    </div>
                    <div className="col-4">
                      <div className="form-check sidebar-setting card-radio">
                        <input className="form-check-input" type="radio" name="data-sidenav-size" id="leftbar-size-full" defaultValue="full" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="leftbar-size-full">
                          <span className="d-flex h-100">
                            <span className="flex-shrink-0">
                              <span className="d-flex h-100 flex-column">
                                <span className="d-block p-1 bg-dark-lighten mb-1" />
                              </span>
                            </span>
                            <span className="flex-grow-1">
                              <span className="d-flex h-100 flex-column">
                                <span className="bg-light d-block p-1" />
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Full Layout</h5>
                    </div>
                    <div className="col-4">
                      <div className="form-check sidebar-setting card-radio">
                        <input className="form-check-input" type="radio" name="data-sidenav-size" id="leftbar-size-fullscreen" defaultValue="fullscreen" />
                        <label className="form-check-label p-0 avatar-md w-100" htmlFor="leftbar-size-fullscreen">
                          <span className="d-flex h-100">
                            <span className="flex-grow-1">
                              <span className="d-flex h-100 flex-column">
                                <span className="bg-light d-block p-1" />
                              </span>
                            </span>
                          </span>
                        </label>
                      </div>
                      <h5 className="font-14 text-center text-muted mt-2">Fullscreen Layout</h5>
                    </div>
                  </div>
                </div>
                <div id="layout-position">
                  <h5 className="my-3 font-16 fw-bold">Layout Position</h5>
                  <div className="btn-group radio" role="group">
                    <input type="radio" className="btn-check" name="data-layout-position" id="layout-position-fixed" defaultValue="fixed" />
                    <label className="btn btn-soft-primary w-sm" htmlFor="layout-position-fixed">Fixed</label>
                    <input type="radio" className="btn-check" name="data-layout-position" id="layout-position-scrollable" defaultValue="scrollable" />
                    <label className="btn btn-soft-primary w-sm ms-0" htmlFor="layout-position-scrollable">Scrollable</label>
                  </div>
                </div>
                <div id="sidebar-user">
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <label className="font-16 fw-bold m-0" htmlFor="sidebaruser-check">Sidebar User Info</label>
                    <div className="form-check form-switch">
                      <input type="checkbox" className="form-check-input" name="sidebar-user" id="sidebaruser-check" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </>
  );
}

export default BorkerUpdate;
