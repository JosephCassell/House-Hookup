import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import logo from '../../../househookup.png';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
          <NavLink to="/spots/new" className="Create-a-Spot">Create a New Spot</NavLink>
          <ProfileButton user={sessionUser} />
      </>
    );
  } else {
    sessionLinks = (
      <>
        <li>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </li>
        <li>
          <OpenModalButton
            buttonText="Sign Up" 
            modalComponent={<SignupFormModal />}
          />
        </li>
      </>
    );
  }

  return (
    <div className="navbar">
      <NavLink to="/" className="navbar-logo">
        <img src={logo} alt="Home" />
      </NavLink>
      <div className="navbar-links">
        <ul>
          {isLoaded && sessionLinks}
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
