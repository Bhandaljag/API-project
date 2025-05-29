import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
   <>
   <ul className='navigation'>
      <li className='nav-left'>
         <NavLink to="/"> 
        {/* className="logo-link"> */} 
          <img className="logo" src="/692.jpg" alt="Logo" />
        </NavLink>
      </li>
      {isLoaded && (
        <li className='nav-right'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
    </>
  );
}
 
export default Navigation;