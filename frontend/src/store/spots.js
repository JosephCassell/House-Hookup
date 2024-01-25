export const LOAD_SPOTS = 'spots/loadSpots';
export const LOAD_SPOT_DETAILS = 'spots/loadSpotDetails';
export const LOAD_SPOT_REVIEWS = 'spots/loadSpotReviews';
export const CREATE_SPOT = 'spots/createSpots';
export const ADD_SPOT_IMAGE = 'spots/addSpotImage';
export const CREATE_SPOT_REVIEW = 'spots/createSpotReview';
export const LOAD_USER_SPOTS = 'spots/loadUserSpots';

import { csrfFetch } from "./csrf";
export const loadUserSpots = (spots) => {
    return {
        type: LOAD_USER_SPOTS,
        spots
    };
};

export const load = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    };
};
export const addSpotImageAction = (spotId, image) => {
    return {
        type: ADD_SPOT_IMAGE,
        spotId,
        image
    };
};
export const loadSpotDetails = (details) => {
    return {
        type: LOAD_SPOT_DETAILS,
        details
    };
};
export const createSpotAction  = (spot) => {
    return {
        type: CREATE_SPOT,
        spot
    };
};
export const loadSpotReviews = (spotId, reviews) => {
    return {
        type: LOAD_SPOT_REVIEWS,
        spotId,
        reviews,
    };
};
export const addSpotReviewAction = (review) => {
    return {
        type: CREATE_SPOT_REVIEW,
        review
    };
};
export const addSpotImage = (spotId, imageUrl) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({url: imageUrl})
    });

    if (response.ok) {
        const image = await response.json();
        dispatch(addSpotImageAction(spotId, image));
        return image;
    }
};
export const fetchSpots = () => async dispatch =>{
    const response  = await csrfFetch(`api/spots`)

    if (response.ok) {
        const list = await response.json();
        dispatch(load(list.Spots));
        return list
    }
};

export const fetchSpotDetails = (spotId) => async dispatch => {
    const response  = await csrfFetch(`/api/spots/${spotId}`)

    if (response.ok) {
        const details = await response.json();
        dispatch(loadSpotDetails(details));
        return details
    }
}
export const fetchSpotReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadSpotReviews(spotId, reviews));
        return reviews;
    }
};
export const createSpot = (spotData) => async dispatch => {
    const response = await csrfFetch(`/api/spots/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotData)
    });

    if (response.ok) {
        const createdSpot = await response.json();
        dispatch(createSpotAction(createdSpot));
        return createdSpot;
    }
};
export const createSpotReview = (spotId, reviewData) => async dispatch => {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });

        if (response.ok) {
            const review = await response.json();
            dispatch(addSpotReviewAction(review));
            return review;
        }
};
export const fetchUserSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots/current`);

    if (response.ok) {
        const list = await response.json();
        dispatch(loadUserSpots(list.Spots));
        return list;
    }
};


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
            let newState = {};
            newState.spotDetails = action.details;
            return newState;
        case LOAD_SPOT_REVIEWS:
            return {
                ...state,
                [action.spotId]: {
                    ...(state[action.spotId] || {}),
                    reviews: action.reviews,
                }
            };
        case CREATE_SPOT:
            const { spot } = action;
            return {
                ...state,
                [spot.id]: spot
        };
        case ADD_SPOT_IMAGE:
            return {
            ...state,
            [action.spotId]: {
            ...state[action.spotId],
            images: state[action.spotId].images ? [...state[action.spotId].images, action.image] : [action.image]
            }
        };
        case CREATE_SPOT_REVIEW:
    
    const spotExists = state[action.review.spotId];
    const spotReviews = spotExists ? state[action.review.spotId].reviews || {} : {};

    return {
        ...state,
        [action.review.spotId]: {
            ...state[action.review.spotId], 
            reviews: {
                ...spotReviews,
                [action.review.id]: action.review
            }
        }
    };
    case LOAD_USER_SPOTS:
            let userSpots = {};
            action.spots.forEach((spot) => {
                userSpots[spot.id] = spot;
            });
            return {
                ...state,
                userSpots
            };
        default: 
            return state;
    }
};

export default spotsReducer;