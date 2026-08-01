import { useEffect, useRef } from 'react'; 
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import "react-image-lightbox/style.css";
import './App.css';

import HomeOne from './pages/HomeOne';
import HomeTwo from './pages/HomeTwo';
import HomeThree from './pages/HomeThree';
import HomeFour from './pages/HomeFour';
import HomeFive from './pages/HomeFive';
import HomeSix from './pages/HomeSix';
import HomeSeven from './pages/HomeSeven';
import ScrollToTop from './common/ScrollToTop';
import Property from './pages/Property';
import PropertySidebar from './pages/PropertySidebar';
import PropertyDetails from './pages/PropertyDetails';
import AddListing from './pages/AddListing';
import MapLocation from './pages/MapLocation';
import AboutUs from './pages/AboutUs';
import FaqPage from './pages/FaqPage';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Account from './pages/Account';
import Project from './pages/Project';
import ProjectDetails from './pages/ProjectDetails';
import BlogClassic from './pages/BlogClassic';
import BlogDetails from './pages/BlogDetails';
import Contact from './pages/Contact';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Dashoboard from './components/Dashoboard';
import BrokerDashboard from './components/BrokerDashboard';
import ClientDashboard from './components/ClientDashboard';
import BrokerRegistration from './components/BrokerRegistration';
import BrokerLists from './components/BrokeLists';
import BrokerDetails from './components/BrokerDetails';
import AdminLogin from './components/AdminLogin';
import PropertyCreation from './components/ProperyCreation';
import PropertiesList from './components/PropertiesList';
import ClientLists from './components/ClientLists';
import BrokerPropertyLists from './components/BrokerPropertyList';
import PropertyDetailsView from './components/PropertyDetailsView';
import UserDetails from './components/UserDetails';
import PropertyUpdation from './components/PropertyUpdation';
import MyClientProfile from './components/Myprofile';
import BorkerUpdate from './components/BrokerProfile';
import LandingPageBuilder from './components/CreateLandingPage';
import FAQs from './components/Faqs';
import PrivacyPolicyCMS from './components/Privacypolicy';
import TermsConditions from './components/Tncs';
import Leads from './components/PropertyLeads';

function App() {

  // This code will run when i will go to item details page. it will scroll me to template top. And when i back to the previous page it will redirect me to the exact previous position.
  const Wrapper = ({ children }) => {
    const location = useLocation();
    const navigationType = useNavigationType();
    const scrollPositions = useRef({});

    useEffect(() => {
      const handleScroll = () => {
        scrollPositions.current[location.pathname] = window.scrollY;
      };

      if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
        document.documentElement.scrollTo(0, 0);
      } else if (navigationType === 'POP') {
        const savedPosition = scrollPositions.current[location.pathname];
        if (savedPosition !== undefined) {
          window.scrollTo(0, savedPosition);
        }
      }

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname, navigationType]);

    return children;
  };
  // This code will run when i will go to item details page. it will scroll me to template top. And when i back to the previous page it will redirect me to the exact previous position.
  
  return (
    <>
      <BrowserRouter>
        <Wrapper>
          <Routes>
            <Route path="/" element={<HomeOne />} />
            <Route path="/home-two" element={<HomeTwo />} />
            <Route path="/home-three" element={<HomeThree />} />
            <Route path="/home-four" element={<HomeFour />} />
            <Route path="/home-five" element={<HomeFive />} />
            <Route path="/home-six" element={<HomeSix />} />
            <Route path="/home-seven" element={<HomeSeven />} />
            <Route path="/property" element={<Property />} />
            <Route path="/property-sidebar" element={<PropertySidebar />} />
            <Route path="/property/:title" element={<PropertyDetails />} />
            <Route path="/add-new-listing" element={<AddListing />} />
            <Route path="/map-location" element={<MapLocation />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/broker/registration" element={<BrokerRegistration />} />
            <Route path="/account" element={<Account />} />
            <Route path="/project" element={<Project />} />
            <Route path="/project/:title" element={<ProjectDetails />} />
            <Route path="/blog" element={<BlogClassic />} />
            <Route path="/blog/:title" element={<BlogDetails />} />
            <Route path="/admin/dashboard" element={<Dashoboard />} />
            <Route path="/broker/dashboard" element={<BrokerDashboard />} />
            <Route path="/user/dashboard" element={<ClientDashboard />} />
            <Route path="/admin/brokers" element={<BrokerLists />} />
            <Route path="/admin/broker-details/:id" element={<BrokerDetails />} />
           <Route path="/broker/profile/:id" element={<BorkerUpdate />} />
            <Route path="/admin/clients" element={<ClientLists />} />
            <Route path="/admin/property-listing" element={<PropertyCreation />} />
            <Route path="/broker/property-listing" element={<PropertyCreation />} />
            <Route path="/admin/properties" element={<PropertiesList />} />
            <Route path="/brokers/properties/:id" element={<BrokerPropertyLists />} />
            <Route path="/property-details/:id" element={<PropertyDetailsView />} />
            <Route path="/admin/edit-property/:id" element={<PropertyUpdation />} />
            <Route path="/admin/user-details/:id" element={<UserDetails />} />
            <Route path="/profile/:id" element={<MyClientProfile />} />
            <Route path="/admin/create-landing-page" element={<LandingPageBuilder />} />
            <Route path="/property/details/:id" element={<PropertyDetails />} />
            <Route path="/admin/cms/faqs" element={<FAQs />} />
            <Route path="/admin/leads" element={<Leads />} />
            <Route path="/admin/cms/privacy-policy" element={<PrivacyPolicyCMS />} />
            <Route path="/admin/cms/tnc" element={<TermsConditions />} />

           
            
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Wrapper>
      </BrowserRouter>

      <ScrollToTop/>
    </>
  );
}

export default App;
