import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './SpotDetails.css';
import { useNavigate } from 'react-router-dom'; 
import { fetchSpotDetails, fetchSpots} from '../../store/spots';
const SpotDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const spots = useSelector(state => state.spots);
  const [spot, setSpot] = useState(spots[id])
  useEffect(() => {
      dispatch(fetchSpotDetails(id));
    }, [dispatch]);

  if (!spot) return <div>Loading...</div>
  return (
    <div className="spot-details">
      <header>
        <h1>{spot?.name}</h1>
        <p>{`${spot?.city}, ${spot?.state}, ${spot?.country}`}</p>
      </header>

      </div>
    );
  };
export default SpotDetails;
