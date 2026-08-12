import { useEffect, useRef, lazy, Suspense } from 'react'; 
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import "react-image-lightbox/style.css";
import './App.css';
import ScrollToTop from './common/ScrollToTop';

// Lazy loaded page components
const HomeOne = lazy(() => import('./pages/HomeOne'));
const HomeTwo = lazy(() => import('./pages/HomeTwo'));
const HomeThree = lazy(() => import('./pages/HomeThree'));
const HomeFour = lazy(() => import('./pages/HomeFour'));
const HomeFive = lazy(() => import('./pages/HomeFive'));
const HomeSix = lazy(() => import('./pages/HomeSix'));
const HomeSeven = lazy(() => import('./pages/HomeSeven'));
const Property = lazy(() => import('./pages/Property'));
const PropertySidebar = lazy(() => import('./pages/PropertySidebar'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const AddListing = lazy(() => import('./pages/AddListing'));
const MapLocation = lazy(() => import('./pages/MapLocation'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Account = lazy(() => import('./pages/Account'));
const Project = lazy(() => import('./pages/Project'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const BlogClassic = lazy(() => import('./pages/BlogClassic'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const Register = lazy(() => import('./pages/Register'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin / Dashboard components
const Dashoboard = lazy(() => import('./components/Dashoboard'));
const BrokerDashboard = lazy(() => import('./components/BrokerDashboard'));
const ClientDashboard = lazy(() => import('./components/ClientDashboard'));
const BrokerRegistration = lazy(() => import('./components/BrokerRegistration'));
const BrokerLists = lazy(() => import('./components/BrokeLists'));
const BrokerDetails = lazy(() => import('./components/BrokerDetails'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const PropertyCreation = lazy(() => import('./components/ProperyCreation'));
const PropertiesList = lazy(() => import('./components/PropertiesList'));
const ClientLists = lazy(() => import('./components/ClientLists'));
const BrokerPropertyLists = lazy(() => import('./components/BrokerPropertyList'));
const PropertyDetailsView = lazy(() => import('./components/PropertyDetailsView'));
const UserDetails = lazy(() => import('./components/UserDetails'));
const PropertyUpdation = lazy(() => import('./components/PropertyUpdation'));
const MyClientProfile = lazy(() => import('./components/Myprofile'));
const BorkerUpdate = lazy(() => import('./components/BrokerProfile'));
const LandingPageBuilder = lazy(() => import('./components/CreateLandingPage'));
const PublishedLandingPage = lazy(() => import('./pages/PublishedLandingPage'));
const FAQs = lazy(() => import('./components/Faqs'));

const PrivacyPolicyCMS = lazy(() => import('./components/Privacypolicy'));
const TermsConditions = lazy(() => import('./components/Tncs'));
const Leads = lazy(() => import('./components/PropertyLeads'));
const SalesReport = lazy(() => import('./components/SalesReport'));
const BrokerReport = lazy(() => import('./components/BrokerReport'));
const ClientActivityReport = lazy(() => import('./components/ClientActivityReport'));
const AdminProfile = lazy(() => import('./components/AdminProfile'));
const AdminSettings = lazy(() => import('./components/AdminSettings'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

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
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomeOne />} />
              <Route path="/home-two" element={<HomeTwo />} />
              <Route path="/home-three" element={<HomeThree />} />
              <Route path="/home-four" element={<HomeFour />} />
              <Route path="/home-five" element={<HomeFive />} />
              <Route path="/home-six" element={<HomeSix />} />
              <Route path="/home-seven" element={<HomeSeven />} />
              <Route path="/property" element={<Property />} />
              <Route path="/properties" element={<Property />} />
              <Route path="/property-sidebar" element={<PropertySidebar />} />
              <Route path="/property/:title" element={<PropertyDetails />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/property/details/:id" element={<PropertyDetails />} />
              <Route path="/add-new-listing" element={<AddListing />} />
              <Route path="/map-location" element={<MapLocation />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/faqs" element={<FaqPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/broker/registration" element={<BrokerRegistration />} />
              <Route path="/account" element={<Account />} />
              <Route path="/project" element={<Project />} />
              <Route path="/projects" element={<Project />} />
              <Route path="/project/:title" element={<ProjectDetails />} />
              <Route path="/blog" element={<BlogClassic />} />
              <Route path="/blogs" element={<BlogClassic />} />
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
              <Route path="/landing/:slug" element={<PublishedLandingPage />} />
              <Route path="/admin/cms/faqs" element={<FAQs />} />

              <Route path="/admin/leads" element={<Leads />} />
              <Route path="/admin/cms/privacy-policy" element={<PrivacyPolicyCMS />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyCMS />} />
              <Route path="/privacy" element={<PrivacyPolicyCMS />} />
              <Route path="/admin/cms/tnc" element={<TermsConditions />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/tnc" element={<TermsConditions />} />
              <Route path="/admin/reports/sales" element={<SalesReport />} />
              <Route path="/admin/reports/brokers" element={<BrokerReport />} />
              <Route path="/admin/reports/clients" element={<ClientActivityReport />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contact-us" element={<Contact />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Wrapper>
      </BrowserRouter>

      <ScrollToTop/>
    </>
  );
}

export default App;
