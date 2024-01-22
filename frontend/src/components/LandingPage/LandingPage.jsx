import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { fetchSpots } from '../../store/spots';
import './LandingPage.css';

const LandingPage = () => {
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

export default LandingPage;
