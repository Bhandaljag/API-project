import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchSpots} from '../../store/spots';
import { Link } from 'react-router-dom';

export default function SpotIndex() {
    const dispatch = useDispatch();
    const spots = Object.values(useSelector(state => state.spots.spots));

    useEffect (() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    return (
        <div className='spot-list'>
        {spots.map(spot => (
            <Link key={spot.id} to={`/spots/${spot.id}`}>
                <div className='spot-tile'>
                    <img src={spots.previewImage} alt='spot-image' />
                    <h3>{spot.name}</h3>
                    <p>{spot.city}, {spot.state}</p>
                    <p>${spot.price} / night</p>
                </div>
            </Link>
        ))}
        </div>
    );
}