import { csrfFetch } from "./csrf"; //

const LOAD_SPOTS = 'spots/loadSpots'

const loadSpots = (spots) => ({  // Action creater 
    type: LOAD_SPOTS,
    spots
});

// Thunk get all spots index
export const fetchSpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots'); // fetch from backend 
    const data = await res.json();
    dispatch(loadSpots(data.spots));
};

export const fetchSpotDetails = (spotId) => async (disp)

const spotsReducer = (state = {}, action) => { // Redux reducer for spots 
    switch (action.type) {
        case LOAD_SPOTS:{                       // <== revieves action 
            const newState = {};                // <== creates new object
            action.spots.forEach(spot => {
                newState[spot.id] = spot;       // iterates over each spot and saves it in state by its keyed id
            });
            return newState;
        }
            default:
                return state;
    
    }
}

export default spotsReducer