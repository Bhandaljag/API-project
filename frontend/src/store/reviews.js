import { csrfFetch } from "./csrf";

const LOAD_SPOT_REVIEWS = 'reviews/loadSpotReviews';

const loadSpotReviews = (spotId, reviews) => ({
    type: LOAD_SPOT_REVIEWS,
    spotId,
    reviews
});

export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();
    dispatch(loadSpotReviews(spotId, data.Reviews));
};

const initialState = {};
const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOT_REVIEWS: {
            const newState = { ...state };
            newState[action.spotId] = {};
            action.reviews.forEach(review => {
                newState[action.spotId][review.id] = review
            });
            return newState;
        
        }
        default:
        return state;
    }
};

export default reviewsReducer;



