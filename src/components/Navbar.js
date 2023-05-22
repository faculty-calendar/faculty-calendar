import { useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/main.css';
import HandleDrawer from './Drawer/HandleDrawer.js';
import { auth } from '../firebase';



function Navbar({ user, onExport }) {
  const navRef = useRef();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const showNavbar = () => {
    navRef.current.classList.toggle('responsive_nav');
  };

  const handleAddEventClick = () => {
    console.log('handleAddEventClick called');
    setDrawerOpen(true);
  };

  const userId = auth.currentUser ? auth.currentUser.uid : null;

  return (
    <div>
      <header>
        <div className="avatar" style={{ marginLeft: '-10px', fontSize: 18, position: 'absolute', top: '-13px' }}>
        <Link to="/Profile">
        <img src="https://lh3.googleusercontent.com/-gS1H9KKPz44/AAAAAAAAAAI/AAAAAAAACzc/f3tTCaY2uRk/photo.jpg" alt="Avatar" />
        </Link>

        </div>
        <div className="welcome" style={{ marginLeft: '80px', fontSize: 18, position: 'absolute', top: '25px' }}>
          Welcome {user?.displayName}
        </div>
        <nav ref={navRef}>
          <button className="export-btn" style={{ fontSize: 18, marginRight: '100px', position: 'absolute', right: 0, top: '13px' }} onClick={onExport}>
            Export Calendar
          </button>
          <button className="export-btn" style={{ fontSize: 18, marginRight: '240px', position: 'absolute', right: 0, top: '13px' }} onClick={handleAddEventClick}>
            Add Event
          </button>
          <a href="/#" style={{ fontSize: 18, marginRight: '50px', position: 'absolute', right: 0, top: '23px' }} onClick={() => auth.signOut()}>Logout</a>
          <button className="nav-btn nav-close-btn" onClick={showNavbar}>
            <FaTimes />
          </button>
        </nav>
        <button className="nav-btn" onClick={showNavbar}>
          <FaBars />
        </button>
      </header>
      <HandleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} userId={userId} />
    </div>
  );
}

export default Navbar;
