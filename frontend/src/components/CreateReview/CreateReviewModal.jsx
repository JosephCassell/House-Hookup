import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './CreateReviewModal.css';

const CreateReview = ({ onClose, onSubmit }) => {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [error, setError] = useState('');
  const {id} = useParams();
  const canSubmit = review.length >= 10 && stars > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSubmit) {
      const result = await onSubmit(id, { review, stars }) || {};
      if (result.success) {
        onClose(); 
      } else {
        setError(result.error || 'An unknown error occurred');
      }
    }
    window.location.reload();
  };
  

  const handleStarClick = (starRating) => {
    setStars(starRating);
    setError(''); 
  };

  return (
    <div className="create-review-modal">
      <div className="create-review-content">
        <h2>How was your stay?</h2>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="Review-star-rating">
  {[...Array(5)].map((_, index) => (
    <span
      key={index}
      className={index < stars ? 'star filled' : 'star'}
      onClick={() => handleStarClick(index + 1)}
     >
      ★
      </span>
    ))}
  </div>
  <button
   className="submit-review"
   disabled={!canSubmit}
    onClick={handleSubmit}
  >
    Submit Your Review
  </button>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default CreateReview;
