import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchSpotDetails } from '../../store/spots'

export default function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots[spotId]);

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
    }, [dispatch, spotId]);

    if (!spot) return <p>Loading...</p>

    return (
        <div className="spot-details">
            <h1>{spot.name}</h1>
            <p>{spot.city}, {spot.state}</p>
            <p>{spot.description}</p>
            <p>${spot.price} per night</p>
            {spot.previewImage && (
                <img src={spot.previewImage} alt={spot.name} />
            )}
        </div>
    )
}