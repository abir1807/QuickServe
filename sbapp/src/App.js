import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { Routes,Route } from 'react-router-dom';
import Landing from './components/Landing';
import ServiceRegister from './components/ServiceRegister';
import UserRegister from './components/UserRegister';
import Login from './components/Login';

import PrroviderLogin from './components/PrroviderLogin';
import Dashboard from './page/Dashboard';
import Categories from './page/Categories';
import Services from './page/Services';
import Providers from './page/Providers';
import UpdateProfile from './page/Updateprofile';
import MyServices from './components/MyServices';
import AddService from './page/AddService';
import AddMap from './page/AddMap';
import "leaflet/dist/leaflet.css";
import CategoryServices from './components/CategoryServices';
import RegistrationSuccessful from './components/RegistrationSuccessful';
import ServiceAdded from './page/ServiceAdded';
import ServiceProviders from './components/ServiceProvider';
import BookingPage from './page/Booking';
import ProtectedRoute from './components/ProtectedRoute';
import MyBookings from './components/MyBookings';
import UserBookings from './page/Userbooking';
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css"; 
import AdminLogin from './components/admin/AdminLogin';
import AdminUsers from './components/admin/AdminUsers';
import AdminBookings from './components/admin/AdminBookings';
import AdminDashboard from './components/admin/Admindashboard';
import AdminProviders from './components/admin/AdminProviders';
import AdminServices from './components/admin/AdminServices';
import AdminCategories from './components/admin/AdminCategories';
import SearchResults from './components/SearchResult';
import AdminServiceTypes from './components/admin/AdminServiceType';
import OurStory from './components/OurStory';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="Home" element={<Landing />} />
        <Route path="ServiceRegister" element={<ServiceRegister />} />
        <Route path="UserRegister" element={<UserRegister />} />
        <Route path="Login" element={<Login />} />
        <Route path="Logout" element={<Landing />} />
   
        <Route path="PrroviderLogin" element={<PrroviderLogin />} />
        <Route path="servicedashboard" element={<Dashboard/>} />
        <Route path="categories" element={<Categories/>} />
        <Route path="service" element={<Services/>} />
        <Route path="provider" element={<Providers/>} />

        <Route path="Myservices" element={<MyServices/>}/>
        <Route path="AddService" element={<AddService/>}/>
        <Route path="AddMap" element={<AddMap/>}/>

        <Route path="/category/:cid" element={<CategoryServices />} />

        <Route path='/registrationsuccessful' element={<RegistrationSuccessful/>}/>
        <Route path="/serviceadded" element={<ServiceAdded/>}/>

        <Route path="/category/:cid" element={<CategoryServices />} />
        <Route 
  path="/booking/:providerId" 
  element={
    <ProtectedRoute>
      <BookingPage />
    </ProtectedRoute>
  } 
/>

<Route path="/service/:serviceId" element={<ServiceProviders />} />
<Route path="/myBookings" element={<MyBookings />} />
<Route path="/UserBooking" element={<UserBookings />} />
        <Route path="/admin/login"     element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/providers" element={<AdminProviders />} />
<Route path="/admin/users"     element={<AdminUsers />} />
<Route path="/admin/bookings"  element={<AdminBookings />} />

        <Route path="/admin/categories" element={<AdminCategories />} />
<Route path="/admin/services"   element={<AdminServices/>} />

         <Route path="/Profile" element={<UpdateProfile />} />
         
<Route path="/search" element={<SearchResults />} />
<Route path="/OurStory" element={<OurStory />} />

<Route path="/admin/servicetypes" element={<AdminServiceTypes />} />

      </Routes>
  
    </div>
  );
}

export default App;
