import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddStore from './components/AddStore';
import StoreRatings from './components/StoreRatings';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-store" element={<AddStore />} />
          <Route path="/store/:storeId/ratings" element={<StoreRatings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;