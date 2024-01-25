import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSpots } from '../../store/spots';
import './ManageSpots.css';
import { useNavigate } from 'react-router-dom';

function ManageSpots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.userSpots); 
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserSpots());
    console.log('Spots:', spots);
}, [dispatch]);


 
  const handleUpdate = (spotId) => {
    console.log('Update spot with id:', spotId);
  };

  const handleDelete = (spotId) => {
    console.log('Delete spot with id:', spotId);
  };
  
  const handleSpotClick = () => {
    navigate(`/spots/new`);
  };
  return (
    <div className='manage-spots-container'>
      <h1>Manage Your Spots</h1>
      <button onClick={handleSpotClick}>Create a New Spot</button>
      <div className='spots-listing'>
      {spots &&Object.values(spots).map((spot) => (
          <div key={spot?.id} className='spot-container'>
            <img src={spot?.previewImage} alt={spot?.name} className='spot-image'/>
            <div className='spotInfo'>
              <h2>{spot?.name}</h2>
              <p>{spot?.city}, {spot?.state}</p>
              <p>${spot?.price} per night</p>
              <p>★ {spot?.avgRating}</p>
            </div>
            <div className='spot-actions'>
              <button onClick={() => handleUpdate(spot?.id)}>Update</button>
              <button onClick={() => handleDelete(spot?.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpots;
