import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './SpotDetails.css';
import { useNavigate } from 'react-router-dom'; 
import { fetchSpotDetails, fetchSpots} from '../../store/spots';
const SpotDetails = () => {
  // const dispatch = useDispatch();
  // const { id } = useParams();
  // // const spots = useSelector(state => state.spots);
  // // const [spot, setSpot] = useState(spots[id])
  // // useEffect(() => {
  // //     dispatch(fetchSpotDetails(id));
  // //     console.log(dispatch(fetchSpotDetails(id)))
  // //   }, [dispatch]);
  // const getSpots = useSelector(state => state.spots);
  //   const spotsArray = Object.values(getSpots);
  //   let spot = spotsArray[id]
  //   useEffect(() => {
  //       dispatch(fetchSpots());
  //   }, [dispatch]);
  // return (
  //   <div className="spot-details">
  //     <header>
  //       <h1>{spot?.name}</h1>
  //       <p>{`${spot?.city}, ${spot?.state}, ${spot?.country}`}</p>
  //     </header>

  //     </div>
  //   );
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const getSpots = useSelector(state => state.spots);
    const spotsArray = Object.values(getSpots);

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    
    const handleSpotClick = (spotId) => {
        navigate(`/spots/${spotId}`);
    };

    if (!getSpots) return <div>Loading...</div>;


    return (
        <>
           <div className="spots-container">
                {spotsArray && spotsArray.map((spot)  => (
                    <div key={spot?.id} className="spot-tile" onClick={() => handleSpotClick(spot?.id)} title={spot?.name}>
                        <img src={spot?.previewImage} alt={spot?.name} />
                        <div className="spot-info">
                            <p className="spot-location">{`${spot?.city}, ${spot?.state}`}</p>
                            <p className="spot-price">{`$${spot?.price} night`}</p>
                            <p className="star-rating">
                                {spot?.avgRating && spot?.avgRating > 0 ? `${spot?.avgRating} ★` : "New"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
  };
export default SpotDetails;
