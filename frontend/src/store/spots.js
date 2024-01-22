export const LOAD_SPOTS = 'spots/loadSpots';
export const LOAD_SPOT_DETAILS = 'spots/loadSpotDetails';

export const load = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    };
};

export const loadSpotDetails = (details) => {
    return {
        type: LOAD_SPOT_DETAILS,
        details
    };
};

export const fetchSpots = () => async dispatch =>{
    const response  = await fetch(`api/spots`)

    if (response.ok) {
        const list = await response.json();
        dispatch(load(list.Spots));
        return list
    }
};

export const fetchSpotDetails = (spotId) => async dispatch => {
    const response  = await fetch(`api/spots/${spotId}`)

    if (response.ok) {
        const details = await response.json();
        dispatch(loadSpotDetails(details));
        return details
    }
}


let initialState = {};  

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            let newSpots = {...state};
            action.spots.forEach((spot) => {
                 newSpots[spot.id] = spot;
            });
            return newSpots;

        case LOAD_SPOT_DETAILS:
            let newState = {...state};
            newState[action.details.id] = action.details;
            return newState;

        default: 
            return state;
    }
};

export default spotsReducer;