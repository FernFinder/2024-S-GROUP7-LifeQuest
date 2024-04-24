import React, { useState } from "react";
import NavigationPanel from "../../components/NavigationPanel";
import Frame from "../../components/TopPanel";
import PageContent from "../../components/PageContent";
import styles from "./SettingsPage.module.css";
import { useFontSize } from '../../contexts/FontSizeContext';
import axios from "axios";

const SettingsPage = () => {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize, darkMode, toggleDarkMode } = useFontSize();
  const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);

  async function handleLogoutClick(){

    //PUT new cookie value to logout
    const putResponse = await axios.put("/login/logout", {}, { withCredentials: true })
    .then(function (response){
      //handle success
      console.log(response);
      window.location.href = '/';
    })
    .catch(function (error) {
      // handle error
      if (error.response.status == 401){
        //unauthorized users get booted back to login
        window.location.href = '/'
      }
      console.log(response);
    }) 

  };

  async function handleDeleteAccountClick() {

    //Get rid of account deletion popup
    setShowDeleteAccountPopup(false);

    //Our back end address
    axios.defaults.baseURL = 'http://localhost:9000';

    var email;
    
    //GET the current user
    await axios.get('/users/me', { withCredentials: true })
    .then(function (response) {
        // handle success
        console.log(response);
        email = response.data.email;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        if (error.response.status == 401){
          //unauthorized users get booted back to login
          window.location.href = '/'
        }
    })

    //DELETE the current user
    await axios.delete(`/users/${email}`, { withCredentials: true })
    .then(function (response){
      //handle success
      console.log(response)
    })
    .catch(function (error) {
      // handle error
      console.log(response);
    })

    //PUT new cookie value to logout
    const putResponse = await axios.put("/login/logout", {}, { withCredentials: true })
    .then(function (response){
      //handle success
      console.log(response);
      window.location.href = '/';
    })
    .catch(function (error) {
      // handle error
      console.log(response);
      window.location.href = '/';
    }) 

  };

  return (
    <div className={`${styles.settingsPage} ${darkMode ? styles.darkMode : ''}`} style={{ fontSize: `${fontSize}px` }} data-testid="settings-page">
      <NavigationPanel />
      <label className={styles.pageLabel} htmlFor="page_label">
        <div className={styles.settingsPagePage}>
          Settings Page
        </div>
      </label>
      <Frame />
      <PageContent
        pageContentHeight="511px"
        pageContentPosition="absolute"
        pageContentTop="178px"
        pageContentLeft="26px"
      />
      
      <div className={styles.fontSizeControls}>
        <div>
          Text Size
        </div>
		<div className={styles.fontSizeButtonContainer}>
          <button onClick={decreaseFontSize} className={styles.decreaseButton}>
            -
          </button>
          <button onClick={resetFontSize} className={styles.resetButton}>
            RESET
          </button>
          <button onClick={increaseFontSize} className={styles.increaseButton}>
            +
          </button>
		</div>
      </div>  
	  <div className={styles.themeControls}>
		<button onClick={toggleDarkMode} className={styles.darkModeButton}>
		  {darkMode ? 'Light Mode' : 'Dark Mode'}
		</button>
	  </div>
	  <div className={styles.resetQuizButtonContainer}>
      <button onClick={() => {window.location.href = '/quiz';}} className={styles.resetQuizButton}>
		  Retake Quiz
		  </button>
	  </div>
	  <div className={styles.logoutButtonContainer}>
	    <button onClick={handleLogoutClick} className={styles.logoutButton}>
		  Logout
		</button>
	  </div>
	  <div className={styles.deleteAccountButtonContainer}>
	    <button onClick={() => setShowDeleteAccountPopup(true)} className={styles.deleteAccountButton}>
		  Delete Account
		</button>
		{showDeleteAccountPopup && (
          <div className={styles.deleteAccountButtonpopup} data-testid="delete-account-popup">
            <p>Are you sure you want to delete your account?</p>
            <button onClick={() => setShowDeleteAccountPopup(false)}>Cancel</button>
            <button onClick={handleDeleteAccountClick}>Confirm</button>
          </div>
        )}
	  </div>
    </div>
  );
};

export default SettingsPage;
