import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [credentials, setCredentials] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', credentials);
            if (response.data) {
                alert("Account created successfully!");
                navigate('/'); // Redirect to login page
            }
        } catch (err) {
            // Displays the specific validation errors from your backend
            setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || "An error occurred");
        }
    };

    return (
        <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '500px' }}>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Full Name (Min 20 characters)</label>
                    <input type="text" className="form-control" name="name" onChange={onChange} required minLength={20} maxLength={60} />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" onChange={onChange} required />
                </div>
                <div className="mb-3">
                    <label>Password (8-16 chars, 1 Uppercase, 1 Special)</label>
                    <input type="password" className="form-control" name="password" onChange={onChange} required minLength={8} maxLength={16} />
                </div>
                <div className="mb-3">
                    <label>Address</label>
                    <input type="text" className="form-control" name="address" onChange={onChange} required maxLength={400} />
                </div>
                <div className="mb-3">
                    <label>Role</label>
                    <select className="form-select" name="role" onChange={onChange}>
                        <option value="NORMAL">Normal User</option>
                        <option value="STORE_OWNER">Store Owner</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">Sign Up</button>
                <div className="text-center">
                    <Link to="/">Already have an account? Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;