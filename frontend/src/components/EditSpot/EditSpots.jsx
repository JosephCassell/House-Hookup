import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editSpot, fetchSpotDetails } from '../../store/spots'
import { useNavigate, useParams } from 'react-router-dom';
import './EditSpots.css';

function EditSpot() {
  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector(state => state.spots[id]);
  const [country, setCountry] = useState(spot?.country || '');
  const [address, setStreetAddress] = useState(spot?.address || '');
  const [city, setCity] = useState(spot?.city || '');
  const [state, setState] = useState(spot?.state || '');
  const [lat, setLatitude] = useState(spot?.lat || '');
  const [lng, setLongitude] = useState(spot?.lng || '');
  const [description, setDescription] = useState(spot?.description || '');
  const [name, setTitle] = useState(spot?.name || '');
  const [price, setPrice] = useState(spot?.price || '');
  const [previewImage, setPreviewImage] = useState(spot?.previewImage || '');
  const [additionalImages, setAdditionalImages] = useState(spot?.additionalImages || []);
  const [errors, setErrors] = useState({});
  
  const handleAddAdditionalImage = () => {
    setAdditionalImages([...additionalImages, '']);
  };

  const updateAdditionalImage = (index, url) => {
    const newAdditionalImages = [...additionalImages];
    newAdditionalImages[index] = url;
    setAdditionalImages(newAdditionalImages);
  };
  useEffect(() => {
    if (!spot) {
      dispatch(editSpot({id}))
    }
  }, [dispatch, spot]);
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
    const updatedSpot = await dispatch(editSpot(id, spotData)); // Use editSpot instead of createSpot
    if (updatedSpot) {
      navigate(`/spots/${updatedSpot.id}`);
    }
  };
  const renderError = (key) => {
    if (errors[key]) {
      return <span className="error-message">{errors[key]}</span>;
    }
  };
  return (
    <div className='edit-spot-container'>
      <form onSubmit={handleSubmit} className='edit-spot-form'>
        <h1>Update your Spot</h1>
        <section className='location-section'>
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
        </div> 
        </section>
        <section className='description-section'>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            
            minLength="30"
          />
          {renderError('description')}
          </section>
        <section className='title-section'>
        <h2>Create a title for your spot</h2>
        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
        <input type="text" 
        value={name} 
        onChange={(e) => setTitle(e.target.value)} 
         />
        {renderError('name')}
      </section>
      <section className='price-section'>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            
          />
          {renderError('price')}
          </section>
          <section className='photos-section'>
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
        </section>
        <div className='submit-section'>
          <button type="submit" className='updateSpot'>Update Spot</button>
        </div>
      </form>
    </div>
  );
}

export default EditSpot;
