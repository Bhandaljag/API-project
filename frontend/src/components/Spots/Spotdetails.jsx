import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import { fetchSpotReviews } from "../../store/reviews";
import './Spots.css';

export default function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const spot = useSelector(state => state.spots[spotId]);
    const reviewObj = useSelector(state => state.reviews[spotId]);
    const reviews = reviewObj ? Object.values(reviewObj) : [];

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
        dispatch(fetchSpotReviews(spotId));
    }, [dispatch, spotId]);

    if (!spot) return <p>Spot not found.</p>

    return (
        <div className="spot-details">
            <h1>{spot.name}</h1>
            <p>{spot.description}</p>
            <p>
                {spot.city}, {spot.state}, {spot.country}
            </p>
            <p>${spot.price} per night</p>

            <h2>Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                reviews.map(review => (
                    <div key={review.id} className="review">
                        <p>{review.User?.username}</p>
                        <p>{review.review}</p>
                        <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                ))
            )}
        </div>
    )
}