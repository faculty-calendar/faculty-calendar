import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { motion } from "framer-motion"
import AnimatedText from './animatedtext.js'
import styles from "./Home.module.css";

function Home(props) {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <motion.div className={styles.container} initial={{opacity: "0"}} animate={{opacity: "1",transition: "1.5"}} exit={{opacity: "0"}}>
      
  <div style={{ justifyContent: 'center', display: 'flex', height: '550px', width: '650px', boxShadow: '9px 10px 11px 10px rgba(143,0,245)', paddingTop: "30px", borderRadius: "60px", backgroundColor: "white", position:"relative" }}>
    <div></div>
    <span><br /><br /><AnimatedText text="Faculty Calendar Management System " /></span>
    
    </div>
    


    <div style={{position: "absolute"}}>
    {props.name ? (
      <>
        <h2 className={styles.welcome}>Welcome - {props.name}</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className={styles.logoutButton} onClick={handleLogout} style={{ backgroundColor: 'white', color: 'black' }} ><b>logout</b></button>
        </div>
      </>
    ) : (
      <>
        <div className={styles.loginContainer}>
          <h3 className={styles.loginLink}>
              <p> Already have an account?</p>
              <Link to="/login" ><button style={{ backgroundColor: 'white', color: 'black', padding:" 15px 150px",fontSize: "18px" }}><b> Login</b></button> </Link>
            
            <p style={{ color: 'black' }}>or</p>
          </h3>
          <h3 className={styles.signupLink}>
          <p> New user? Create your new account</p>
              <Link to="/signup"><button style={{ backgroundColor: 'white', color: 'black', padding:" 15px 150px" , fontSize: "18px"}}><b>Sign up</b></button></Link>
            
          </h3>
        </div>
      </>
    )}
    
    </div>


    </motion.div>
  );
}

export default Home;
