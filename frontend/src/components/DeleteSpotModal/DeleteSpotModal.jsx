import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots';
import './DeleteSpotModal.css'; 

const DeleteSpotModal = ({ spotId, onClose }) => {
  const dispatch = useDispatch();

  const handleConfirmDelete = () => {
    dispatch(deleteSpot(spotId));
    window.location.reload(); 
  };

  return (
    <div className='delete-modal-overlay'>
      <div className='delete-modal-content'>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <div className='delete-modal-actions'>
          <button className='confirm-delete-button' onClick={handleConfirmDelete}>Yes (Delete Spot)</button>
          <button className='cancel-button' onClick={onClose}>No (Keep Spot)</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSpotModal;
