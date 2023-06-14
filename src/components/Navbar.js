import { useRef, useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/main.css';
import HandleDrawer from './Drawer/HandleDrawer.js';
import { auth } from '../firebase'; // Update the path to match your file structure
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import Popover from '@mui/material/Popover';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { parseISO, isToday, format } from 'date-fns';

function Navbar({ user, onExport, allEvents }) {
  const navRef = useRef();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNotifications, setOpenNotifications] = useState(false);
  const now = new Date();
  const upcomingEvents = allEvents.filter(event => {
    const eventStart = parseISO(event.start);
    return isToday(eventStart) && eventStart > now;
  });
  const [clearedNotifications, setClearedNotifications] = useState(() => {
    // Retrieve cleared notifications from local storage on component mount
    const storedClearedNotifications = localStorage.getItem('clearedNotifications');
    return storedClearedNotifications ? JSON.parse(storedClearedNotifications) : [];
  });
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

  const handleNotificationsOpen = () => {
    setOpenNotifications(true);
  };

  const openNotificationsDialog = useCallback(() => {
    if (upcomingEvents.length > 0 && clearedNotifications.length !== upcomingEvents.length) {
      setOpenNotifications(true);
    }
  }, [upcomingEvents, clearedNotifications]);

  const handleNotificationsClose = () => {
    setOpenNotifications(false);
  };

  const handleClearNotifications = () => {
    setClearedNotifications(upcomingEvents); // Clear notifications by setting clearedNotifications state to all upcomingEvents
  };

  useEffect(() => {
    // Store cleared notifications in local storage whenever it changes
    localStorage.setItem('clearedNotifications', JSON.stringify(clearedNotifications));
  }, [clearedNotifications]);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const colors = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!openNotifications) {
        openNotificationsDialog();
      }
    }, 12000); // 2 minutes in milliseconds

    return () => {
      clearInterval(interval);
    };
  }, [openNotifications, openNotificationsDialog]);

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
                <Avatar sx={{ width: 60, height: 60, bgcolor: randomColor }}>
                  {user?.displayName?.[0]}
                </Avatar>
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
          <button
            className="export-btn"
            style={{
              fontSize: 1,
              marginRight: '350px',
              position: 'absolute',
              right: 0,
              top: '18px',
            }}
            onClick={handleNotificationsOpen}
          >
            <NotificationsIcon style={{ fontSize: '20px', marginRight: '-15px' }} />
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

      <Dialog open={openNotifications} onClose={handleNotificationsClose} PaperProps={{ sx: { overflowX: 'hidden' } }}>
      <DialogTitle>
    Upcoming Events
    <IconButton
      edge="end"
      color="inherit"
      onClick={handleNotificationsClose}
      aria-label="close"
      sx={{ position: 'absolute', top: 8, right: 8 }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {upcomingEvents.length > 0 ? (
              clearedNotifications.length === upcomingEvents.length ? (
                <p>No notifications</p>
              ) : (
                upcomingEvents.map((event) => (
                  !clearedNotifications.includes(event) ? (
                    <div key={event.id}>
                      <p>{event.title} is scheduled on {format(parseISO(event.start), 'hh:mm a')} today</p>
                    </div>
                  ) : null
                ))
              )
            ) : (
              <p>There are no upcoming events</p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearNotifications} autoFocus>
            Clear all notifications
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Navbar;
