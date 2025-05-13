import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/loadReviews'; // Action Types

const loadReviews = (reviews, spotId) => ({ // Action Creators
    type: LOAD_REVIEWS,
    reviews,
    spotId
});

// Thunk: Fetch reviews for a given spot
export const fetchSpotReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await res.json();
    dispatch(loadReviews(data.Reviews, spotId));
}
    //reducer

    const reviewsReducer = (state = {}, action) => {
        switch (action.type) {
            case LOAD_REVIEWS: {
                const newState = {...state};
                newState[action.spotId] = {};

                action.reviews.forEach(review => {
                    newState[action.spotId][review.id] = review;
                });

                return newState;
            }

            default:
                return state;

    
            
        }
    };

    export default reviewsReducer;


