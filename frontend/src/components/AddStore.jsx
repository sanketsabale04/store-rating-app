import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AddStore = () => {
    const [store, setStore] = useState({ name: '', email: '', address: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => {
        setStore({ ...store, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/stores/addstore', store, {
                headers: { 'auth-token': token }
            });
            navigate('/dashboard'); // Go back to dashboard after saving
        } catch (err) {
            setError(err.response?.data?.error || "Failed to add store");
        }
    };

    return (
        <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '500px' }}>
            <h2 className="text-center mb-4">Add New Store</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Store Name</label>
                    <input type="text" className="form-control" name="name" onChange={onChange} required maxLength={60} />
                </div>
                <div className="mb-3">
                    <label>Store Email</label>
                    <input type="email" className="form-control" name="email" onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label>Store Address</label>
                    <input type="text" className="form-control" name="address" onChange={onChange} required maxLength={400} />
                </div>
                <button type="submit" className="btn btn-success w-100 mb-3">Save Store</button>
                <div className="text-center">
                    <Link to="/dashboard" className="text-secondary">Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default AddStore;