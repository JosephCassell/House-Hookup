import { useDispatch } from 'react-redux';
import { deleteSpotReview } from '../../store/spots';
import './DeleteReviewModal.css'; 

const DeleteReviewModal = ({ reviewId, spotId, onClose }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    await dispatch(deleteSpotReview(reviewId, spotId));
    window.location.reload(); 
  };

  return (
    <div className="delete-review-modal">
      <div className="delete-review-modal-content">
        <h2>Delete Review</h2>
        <p>Are you sure you want to delete this review?</p>
        <div className="delete-review-modal-actions">
          <button onClick={handleDelete} className="delete-review-confirm">
            Yes (Delete Review)
          </button>
          <button onClick={onClose} className="delete-review-cancel">
            No (Keep Review)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReviewModal;
