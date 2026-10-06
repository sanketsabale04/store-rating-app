import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [stores, setStores] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/stores/fetchallstores');
            setStores(response.data);
        } catch (err) {
            setError('Failed to load stores from database');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Store Dashboard</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            {(role === 'ADMIN' || role === 'STORE_OWNER') && (
                <div className="mb-4">
                    <Link to="/add-store" className="btn btn-success">Add New Store</Link>
                </div>
            )}

            <div className="row">
                {stores.length === 0 ? (
                    <p className="text-muted">No stores available yet. Add one!</p>
                ) : (
                    stores.map(store => (
                        <div className="col-md-4 mb-3" key={store.id}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{store.name}</h5>
                                    <p className="card-text text-muted mb-1">{store.address}</p>
                                    <p className="card-text"><small>{store.email}</small></p>
                                    <Link to={`/store/${store.id}/ratings`} className="btn btn-primary btn-sm mt-2">View Ratings</Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;