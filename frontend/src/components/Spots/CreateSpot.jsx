import {useState} from 'react'
import { useDispatch } from 'react-redux';
import { createSpot } from '../../store/spots';

const CreateSpotForm = () => {
    const dispatch = useDispatch();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [stateName, setStateName] = useState('');
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [images, setImages] = useState(['', '', '']);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const spotData = {
            address,
            city,
            state: stateName,
            country,
            name,
            description,
            price,
            previewImage,
            images,

        };

        dispatch(createSpot(spotData)).then((newSpot) => {
            setAddress('');
            setCity('');
            setStateName('');
            setCountry('');
            setName('');
            setDescription('');
            setPrice('');
            setPreviewImage('');
            setImages('');
        })
        .catch(async(res) => {
            const data = await res.json();
            if(data?.errors) {
                setErrors(data.errors);
            }
        })
        
    };

    return (
        <div className='create-spot-container'>
        <h1>Create a New Spot</h1>
        <p>Where's your place located?</p>
        <form onSubmit={handleSubmit} className='create-spot-form'>
            <label>
                Street Address
                <input
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                />
            </label>
            {errors.adress && <p className='error'>{errors.address}</p>}

            <label>
                city
                <input
                type='text'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                />
            </label>
            {errors.city && <p className='errors'>{errors.city}</p>}

            <label>
                State
                <input
                type='text'
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                required
                />
            </label>
            {errors.state && <p className='errors'>{errors.state}</p>}

            <label>
                Country
                <input
                type='text'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                />
            </label>
            {errors.country && <p className='error'>{errors.country}</p>}

            <label>
                Title 
                <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
            </label>
            {errors.name && <p className='error'>{errors.name}</p>}

            <label>
                Describe Your Place to Guests
                <p>Mention the best features of your space.</p>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                />
            </label>
            {errors.description && <p className='error'>{errors.description}</p>}

            <label>
                Price per night
                <input
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                />
            </label>
            {errors.price && <p className='error'>{errors.price}</p>}

            <label>
                Preview Image URL
                <input
                type='text'
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                required
                />
            </label>
            {errors.previewImage && <p className='error'>{errors.previewImage}</p>}

            <label>
                Preview Image URL
                <input
                type='text'
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                required
                />
            </label>
            {errors.previewImage && <p className='error'>{errors.previewImage}</p>}

            <label>
                Preview Image URL
                <input
                type='text'
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                required
                />
            </label>
            {errors.previewImage && <p className='error'>{errors.previewImage}</p>}

            <label>
                Preview Image URL
                <input
                type='text'
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                required
                />
            </label>
            {errors.previewImage && <p className='error'>{errors.previewImage}</p>}
            <label>
                Preview Image URL
                <input
                type='text'
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                required
                />
            </label>
            {errors.previewImage && <p className='error'>{errors.previewImage}</p>}

            
            <button type='submit'>Create Spot</button>

        </form>

        </div>
    )
}

export default CreateSpotForm
