import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './SpotDetails.css';
import { fetchSpotDetails, fetchSpotReviews } from '../../store/spots';
import CreateReview from '../CreateReview/CreateReviewModal';
import {createSpotReview} from '../../store/spots'
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';

const SpotDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [createdreviews, setReviews] = useState([]);
  const spot = useSelector(state => state.spots.spotDetails);
  const reviews = useSelector(state => state.spots[id]?.reviews?.Reviews);
  const currentUser = useSelector(state => state.session.user);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const handleDeleteModalOpen = (reviewId) => {
    setSelectedReviewId(reviewId);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };
  const handleCloseModal = () => {
    setReviewModalOpen(false);
  };
  const handleOpenModal = () => {
    setReviewModalOpen(true);
  };
  const handleReviewSubmit = async (spotId, reviewData) => {
    await dispatch(createSpotReview(spotId, reviewData));
    const updatedReviews = await dispatch(fetchSpotReviews(spotId));
    setReviews(updatedReviews); 
    handleCloseModal();
  };
  useEffect(() => {
    const fetchDetailsAndReviews = async () => {
      await dispatch(fetchSpotDetails(id));
      const fetchedReviews = await dispatch(fetchSpotReviews(id));
      const sortedReviews = fetchedReviews?.Reviews?.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setReviews(sortedReviews);
    };
  
    fetchDetailsAndReviews();
  }, [dispatch, id]);
  
  if (!spot) return <div>Loading...</div>;
  
  const userHasReviewed = reviews?.some(review => review.User.id === currentUser?.id);
  const isOwner = spot.Owner?.id === currentUser?.id;
  return (
    <>
      {spot && (
  <div className="spot-details">
    <header>
      <h1>{spot.name}</h1>
      <p>{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
    </header>

    <div className="image-gallery">
      <div className="gallery-image main-image">
        <img src={spot.previewImage} alt="Main preview" />
      </div>

      {spot.SpotImages.map((image, index) => (
        <div key={index} className="gallery-image sub-image">
          <img src={image.url} alt={`Spot view ${index + 1}`} />
        </div>
      ))}
    </div>

    <div className="details-container">
      <section className="description-section">
        <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
        <p>{spot.description}</p>
      </section>
      
      <aside className="reservation-info">
        <div className="reservation-details">
          <div className="price-per-night">
            <span>${spot.price}</span> per night
          </div>
          <div className="rating-and-reviews">
            <span>★ {spot.avgStarRating} {reviews?.length === 1 ? ` · 1 Review` : reviews?.length > 1 ? ` · ${reviews.length} Reviews` : 'New'}</span>
          </div>
        </div>
        <button onClick={() => alert('Feature Coming Soon...')} className="reserveButton">Reserve</button>
      </aside>
    </div>
    
    <hr />
         


          <section>
            
          <h2>★ {spot.avgStarRating} {reviews?.length === 1 ? ` · 1 Review` : reviews?.length > 1 ? ` · ${reviews.length} Reviews` : 'New'}</h2>
  <div className="rating-and-reviews">
      {currentUser && !userHasReviewed && !isOwner && (
  <button onClick={handleOpenModal}>
    Post Your Review
  </button>
    )}
  </div>
    {reviews?.length ? (
    reviews.map((review, index) => (
      <div key={index} className="review">
        <p><strong>{review.User.firstName}</strong></p>
        <p>{new Date(review.updatedAt).toLocaleDateString('default', { month: 'long', year: 'numeric' })}</p>
        <p>{review.review}</p>
        {currentUser?.id === review.User.id && (
      <button onClick={() => handleDeleteModalOpen(review.id)}>
        Delete
      </button>
       )}
      </div>
    ))
    ) : (
    <p>Be the first to post a review!</p>
   )}
    </section>
        </div>
      )}
      {isDeleteModalOpen && (
      <DeleteReviewModal
        reviewId={selectedReviewId}
        onClose={handleDeleteModalClose}
      />
    )}
      {isReviewModalOpen && (
        <CreateReview
          spotId={id}
          onClose={handleCloseModal}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
};

export default SpotDetails;
