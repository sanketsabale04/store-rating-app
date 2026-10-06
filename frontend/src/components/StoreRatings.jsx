import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const StoreRatings = () => {
    const { storeId } = useParams();
    const [ratings, setRatings] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, review: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchRatings();
    }, [storeId]);

    const fetchRatings = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/ratings/store/${storeId}`);
            setRatings(response.data);
        } catch (err) {
            setError('Failed to load ratings');
        }
    };

    const handleReviewChange = (e) => {
        setNewReview({ ...newReview, [e.target.name]: e.target.value });
    };

    const submitReview = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/ratings/add', 
                { store_id: storeId, rating: newReview.rating, review: newReview.review },
                { headers: { 'auth-token': token } }
            );
            setSuccess('Review added successfully!');
            setNewReview({ rating: 5, review: '' }); 
            fetchRatings(); 
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit review');
        }
    };

    return (
        <div className="row">
            <div className="col-md-12 mb-3">
                <Link to="/dashboard" className="btn btn-secondary btn-sm">← Back to Dashboard</Link>
            </div>
            
            <div className="col-md-4 mb-4">
                <div className="card shadow-sm p-3">
                    <h4>Write a Review</h4>
                    {error && <div className="alert alert-danger p-2">{error}</div>}
                    {success && <div className="alert alert-success p-2">{success}</div>}
                    <form onSubmit={submitReview}>
                        <div className="mb-2">
                            <label>Rating (1-5)</label>
                            <input type="number" className="form-control" name="rating" min="1" max="5" value={newReview.rating} onChange={handleReviewChange} required />
                        </div>
                        <div className="mb-3">
                            <label>Review</label>
                            <textarea className="form-control" name="review" rows="3" value={newReview.review} onChange={handleReviewChange} required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Submit Review</button>
                    </form>
                </div>
            </div>

            <div className="col-md-8">
                <h4>User Ratings</h4>
                {ratings.length === 0 ? (
                    <p className="text-muted">No reviews yet. Be the first!</p>
                ) : (
                    ratings.map(r => (
                        <div className="card shadow-sm mb-3" key={r.id}>
                            <div className="card-body py-2">
                                <div className="d-flex justify-content-between">
                                    <h6 className="mb-1">{r.name}</h6>
                                    <span className="badge bg-warning text-dark">{r.rating} / 5</span>
                                </div>
                                <p className="mb-0 text-muted">{r.review}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StoreRatings;