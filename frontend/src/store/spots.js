import { csrfFetch } from "./csrf"; //

//Action Types
const SET_SPOTS = 'spots/setSpots';
const CLEAR_SPOTS = 'spots/clearSpots';
const REMOVE_SPOTS = 'spots/removeSpot';

//Action Creators
const setSpots = (spots) => ({
    type: SET_SPOTS,
    payload: spots
});

const clearSpots = () => ({
    type: CLEAR_SPOTS
});

const removeSpot = (spotId) => ({
    type: REMOVE_SPOTS,
    payload: spotId
});

//Thunk: Fetch all spots
export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const data = await response.json();
    dispatch(setSpots(data.spots));
    return response;
};

//Thunk: Fetch a single spot's details
export const fetchSpotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const data = await response.json();
    dispatch(setSpots([data.spot]));
    return response
};

//Thunk: Delete a spot
export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    dispatch(removeSpot(spotId));
    return response;
}

//Initial State
const InitialState = {spot: {} };

//Reducer
const spotsReducer = (state = InitialState, action) => {
    switch (action.type) {
        case SET_SPOTS: {
            const newSpots = {};
            action.payload.forEach(spot => {
                newSpots[spot.id] = spot;
            })
            return {...state, spots: newSpots};
        }
        case REMOVE_SPOTS: {
            const newState = {...state, spots: {...state.spots}};
            delete newState.spots[action.payload];
            return newState;
        }
        case CLEAR_SPOTS:
            return {...state, spots: {} };
            default:
                return state;
    }
};

export default spotsReducer