import { useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/main.css';
import HandleDrawer from './Drawer/HandleDrawer.js';
import { auth } from '../firebase'; // Update the path to match your file structure

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

  // Get the user ID of the currently logged-in user
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  return (
    <div>
      <header>
      <div className="welcome" style={{ marginLeft: '0px', fontSize: 18 }} >Welcome {user?.displayName}</div>
        <nav ref={navRef}>
          <button className="export-btn" style={{ fontSize: 18, marginRight: '100px', position: 'absolute', right: 0, top: '13px' }} onClick={onExport}>
            Export Calendar
          </button>
          <button className="export-btn" style={{ fontSize: 18, marginRight: '240px', position: 'absolute', right: 0, top: '13px' }} onClick={handleAddEventClick}>
            Add Event
          </button>
          <a href="/#" style={{ fontSize: 18, marginRight: '50px', position: 'absolute', right: 0, top: '22px' }} onClick={() => auth.signOut()}>Logout</a>
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