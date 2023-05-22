import { useRef, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/main.css';
import HandleDrawer from './Drawer/HandleDrawer.js';
import { auth} from '../firebase'; // Update the path to match your file structure
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';

function Navbar({ user, onExport,allEvents }) {
  const navRef = useRef();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const showNavbar = () => {
    navRef.current.classList.toggle('responsive_nav');
  };

  const handleAddEventClick = () => {
    console.log('handleAddEventClick called');
    setDrawerOpen(true);
  };

  // Get the user ID of the currently logged-in user
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <header>
        <Link style={{ position: 'relative', top: '4px' }}>
          <AccountCircleIcon style={{ color: 'white' }} onClick={handleProfileClick} />
        </Link>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleProfileClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <List>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 'auto', marginRight: 1 }}>
              <Avatar sx={{ width: 60, height: 60 }}>{user?.displayName?.[0]}</Avatar>
            </ListItemIcon>
            <ListItemText primary={user?.displayName} />
          </ListItem>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={user?.displayName} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary={user?.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary={`Number of events scheduled: ${allEvents.length}`} />
            </ListItem>
          </List>
        </Popover>
        <div className="welcome" style={{ marginLeft: '-600px', fontSize: 18 }}>
          Welcome {user?.displayName}
        </div>
        <nav ref={navRef}>
          <button
            className="export-btn"
            style={{
              fontSize: 18,
              marginRight: '100px',
              position: 'absolute',
              right: 0,
              top: '13px',
            }}
            onClick={onExport}
          >
            Export Calendar
          </button>
          <button
            className="export-btn"
            style={{
              fontSize: 18,
              marginRight: '240px',
              position: 'absolute',
              right: 0,
              top: '13px',
            }}
            onClick={handleAddEventClick}
          >
            Add Event
          </button>
          <a
            href="/#"
            style={{
              fontSize: 18,
              marginRight: '50px',
              position: 'absolute',
              right: 0,
              top: '22px',
            }}
            onClick={() => auth.signOut()}
          >
            Logout
          </a>
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
