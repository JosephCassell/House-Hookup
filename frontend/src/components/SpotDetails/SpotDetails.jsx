import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './SpotDetails.css';
import { fetchSpotDetails, fetchSpotReviews } from '../../store/spots';
import CreateReview from '../CreateReview/CreateReviewModal';
import {createSpotReview} from '../../store/spots'

const SpotDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [createdreviews, setReviews] = useState([]);
  const spot = useSelector(state => state.spots.spotDetails);
  const reviews = useSelector(state => state.spots[id]?.reviews?.Reviews);
  const currentUser = useSelector(state => state.session.user);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  
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
      setReviews(fetchedReviews)
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

          <section>
            <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
            <p>{spot.description}</p>
          </section>

          <aside>
        <div className="reservation-info">
          <div className="reservation-details">
            <div className="price-per-night">
              <span>${spot.price}</span> per night
            </div>
              <div className="rating-and-reviews">
                <span>{spot.avgStarRating} ★</span>
             <span>{reviews?.length ? `${reviews.length} reviews` : 'New'}</span>
             </div>
          </div>
            <button onClick={() => alert('Feature Coming Soon...')} className="reserveButton">Reserve</button>
          </div>
        </aside>

          <section>
            
          <h2>{reviews?.length ? `★ ${reviews.length} Reviews` : ' ★ New'}</h2>
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
        <p>{new Date(review.updatedAt).toLocaleDateString()}</p>
        <p>{review.review}</p>
      </div>
    ))
    ) : (
    <p>This spot is new and hasn't been reviewed yet.</p>
   )}
    </section>
        </div>
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
