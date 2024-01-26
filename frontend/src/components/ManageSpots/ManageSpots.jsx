import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSpots } from '../../store/spots';
import './ManageSpots.css';
import { useNavigate } from 'react-router-dom';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal'
function ManageSpots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.userSpots);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserSpots());
}, [dispatch]);

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [currentSpotId, setCurrentSpotId] = useState(null);
 
const handleUpdate = (spotId) => {
  navigate(`/spots/${spotId}/edit`);
};

  const handleDelete = (spotId) => {
    setCurrentSpotId(spotId);
    setIsDeleteModalOpen(true);
  };
  
  const handleCreateNewSpot = () => {
    navigate(`/spots/new`);
  };

  const handleSpotClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };
   return (
    <div className='manage-spots-container'>
      <h1>Manage Spots</h1>
      <button onClick={handleCreateNewSpot} className='CreateSpot'>Create a New Spot</button>
      <div className='manage-spots-listing'>
        {spots && Object.values(spots).map((spot) => (
          <div key={spot?.id} className="manage-spot-tile">
            <img src={spot?.previewImage} alt={spot?.name} onClick={() => handleSpotClick(spot?.id)} title={spot?.name} />
            <div className="manage-spot-info" onClick={() => handleSpotClick(spot?.id)}>
              <p className="manage-spot-location">{`${spot?.city}, ${spot?.state}`}</p>
              <p className="manage-spot-price">{`$${spot?.price} night`}</p>
              <p className="manage-star-rating">{spot?.avgRating && spot?.avgRating > 0 ? `★ ${spot?.avgRating}` : "New"}</p>
            </div>
            <div className='manage-spot-actions'>
              <button onClick={() => handleUpdate(spot?.id)} className='update'>Update</button>
              <button onClick={() => handleDelete(spot?.id)} className='delete'>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {isDeleteModalOpen && <DeleteSpotModal spotId={currentSpotId} onClose={() => setIsDeleteModalOpen(false)} />}
    </div>
  );
}

export default ManageSpots;