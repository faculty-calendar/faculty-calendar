import { useRef } from 'react'
import {FaBars,FaTimes} from "react-icons/fa";
import "../styles/main.css"
function Navbar({ onExport }) {
    const navRef = useRef();
    const showNavbar = () =>{
        navRef.current.classList.toggle("responsive_nav")
    }
  return (
    <div>
        <header>
            <h3></h3>
            <nav ref={navRef}>
                <a href="/#" style={{fontSize: 25}}>Home</a>
                <a href="/#" style={{fontSize: 25}}>Schedule</a>
                <a href="/#" style={{fontSize: 25}}>Logout</a>
                <button className="export-btn" onClick={onExport}>Export Calendar</button>
                <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                    <FaTimes/>
                </button>
            </nav>
            <button className="nav-btn" onClick={showNavbar}>
                <FaBars/>
            </button>
        </header>
    </div>
  )
}

export default Navbar


