import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot, addSpotImage } from '../../store/spots'
import { useNavigate } from 'react-router-dom';
import './CreateSpot.css';
function CreateSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [address, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLatitude] = useState('');
  const [lng, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [name, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState([]);
  const [errors, setErrors] = useState({});
  
  const handleAddAdditionalImage = () => {
    setAdditionalImages([...additionalImages, '']);
  };

  const updateAdditionalImage = (index, url) => {
    const newAdditionalImages = [...additionalImages];
    newAdditionalImages[index] = url;
    setAdditionalImages(newAdditionalImages);
  };
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!country) {
      isValid = false;
      newErrors['country'] = 'Country is required.';
    }
    if (!address) {
      isValid = false;
      newErrors['address'] = 'Street Address is required.';
    }
    if (!city) {
      isValid = false;
      newErrors['city'] = 'City is required.';
    }
    if (!state) {
      isValid = false;
      newErrors['state'] = 'State is required.';
    }
    if (!lat) {
      isValid = false;
      newErrors['lat'] = 'Latitude is required.';
    }
    if (!lng) {
      isValid = false;
      newErrors['lng'] = 'Longitude is required.';
    }
    if (!name) {
      isValid = false;
      newErrors['name'] = 'Name is required.';
    }
    if (!price) {
      isValid = false;
      newErrors['price'] = 'Price is required.';
    }
    if(!previewImage || !/\.(png|jpg|jpeg)$/i.test(previewImage)) {
      isValid = false;
      newErrors['previewImage'] = 'previewImage is required and must end in .png, .jpg, or .jpeg.';
    }
    if (description.length < 30) {
      isValid = false;
      newErrors['description'] = 'Description needs a minimum of 30 characters.';
    }
    if (additionalImages.length > 0) {
      additionalImages.forEach((imageUrl, index) => {
          if (imageUrl && !/\.(png|jpg|jpeg)$/i.test(imageUrl)) {
              isValid = false;
              newErrors[`imageUrl-${index}`] = `Image URL at position ${index + 1} must end in .png, .jpg, or .jpeg`;
          }
      });
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const spotData = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      previewImage
    };
    console.log(spotData)
    const createdSpot = await dispatch(createSpot(spotData));
    if (createdSpot) {
      for (const imageUrl of additionalImages) {
        if (imageUrl) {
          await dispatch(addSpotImage(createdSpot.id, imageUrl)); // Updated line
        }
      }
      navigate(`/spots/${createdSpot.id}`);
    }
  };
  const renderError = (key) => {
    if (errors[key]) {
      return <span className="error-message">{errors[key]}</span>;
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Create a new Spot</h1>
        <h2>Where's your place located?</h2>
        <p>Guests will only get your exact address once they booked a
        reservation</p>
        <div>
          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {renderError('country')}
        </div>
        <div>
          <label>Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setStreetAddress(e.target.value)}
          />
          {renderError('address')}
        </div><div>
          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}

          />
          {renderError('city')}
        </div><div>
          <label>State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            
          />
          {renderError('state')}
        </div><div>
          <label>Latitude</label>
          <input
            type="number"
            value={lat}
            onChange={(e) => setLatitude(e.target.value)}
          />
          {renderError('lat')}
        </div><div>
          <label>Longitude</label>
          <input
            type="number"
            value={lng}
            onChange={(e) => setLongitude(e.target.value)}
          />
          {renderError('lng')}
        </div> <div>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            
            minLength="30"
          />
          {renderError('description')}
        </div>
        <section>
        <h2>Create a title for your spot</h2>
        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
        <input type="text" 
        value={name} 
        onChange={(e) => setTitle(e.target.value)} 
         />
        {renderError('name')}
      </section>
        <div>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            
          />
          {renderError('price')}
        </div>
        <div>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot</p>
          <div>
        <input
          type="text"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
        />
        {renderError('previewImage')}
        </div>
        {additionalImages.map((url, index) => (
      <div key={index}>
        <input
          type="text"
          value={url}
          onChange={(e) => updateAdditionalImage(index, e.target.value)}
          />
          {renderError(`imageUrl-${index}`)}
        </div>
        ))}
        {renderError('imageUrl')}
        <button type="button" onClick={handleAddAdditionalImage} className='AnotherImage'>Add another image</button>
      </div>
        <div>
          <button type="submit" className='createSpot'>Create Spot</button>
        </div>
      </form>
    </div>
  );
}

export default CreateSpot;
