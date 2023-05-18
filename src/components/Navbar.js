import { useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/main.css';
import HandleDrawer from './Drawer/HandleDrawer.js';
import { auth } from '../firebase'; // Update the path to match your file structure

function Navbar({ onExport }) {
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
        <nav ref={navRef}>
          <a href="/#" style={{ fontSize: 25 }}>
            Home
          </a>
          <a href="/#" style={{ fontSize: 25 }}>
            Schedule
          </a>
          <a href="/#" style={{ fontSize: 25 }}>
            Logout
          </a>
          <button className="export-btn" onClick={onExport}>
            Export Calendar
          </button>
          <button className="export-btn" onClick={handleAddEventClick}>
            Add Event
          </button>
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