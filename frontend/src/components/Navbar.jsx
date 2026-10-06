import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to={token ? "/dashboard" : "/"}>
                    Store Rating Platform
                </Link>
                <div className="d-flex">
                    {token ? (
                        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                    ) : (
                        <div>
                            <Link className="btn btn-outline-light btn-sm me-2" to="/">Login</Link>
                            <Link className="btn btn-primary btn-sm" to="/signup">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;