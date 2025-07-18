import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadUserFromSessionStorage } from "../../utils/SessionHandler.js";
import { getUserByEmailId, updateUserById } from "../../api/UserRequests.js";
import "./UserProfile.css";
import { Button } from "../Buttons/Button.jsx";
import { UserUpdatePopup } from "../Popups/UserUpdatePopup.jsx";
import { SkillsSearchBar } from "../Search/SkillsSearchBar.jsx";
import { DomainsSearchBar } from "../Search/DomainsSearchBar.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();  // Add navigate for redirection if needed
  const { user, setUser } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [domains, setDomains] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);

  // function to append skills from the search bar
  const addSkills = (newSkills) => {
    setSkills((prevSkills) => [...prevSkills, newSkills]);
  };

  // function to append career paths from the search bar
  const addDomains = (newDomain) => {
    setDomains((prevDomains) => [...prevDomains, newDomain]);
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const removeDomain = (domainToRemove) => {
    setDomains(domains.filter((domain) => domain !== domainToRemove));
  };

  const showPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const saveUser = () => {
    if (!user || !user.email) {
      console.error("User or user email is not defined.");
      return;
    }
    // Save user profile using PATCH method
    // The updated user must take skills and domains array and update them in the DB
    updateUserById(user.email, skills || [], domains || []);
    showPopup();
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userEmail = sessionStorage.getItem('user_email');
        if (!userEmail) {
          return;
        }

        const userData = await getUserByEmailId(userEmail);
        if (userData) {
          setUser(userData.data);
          setSkills(userData.data.skills || []);
          setDomains(userData.data.career_path || []);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  if (!user) {
    return <div>Loading user profile or user not logged in.</div>;
  }

  return (
    <div className="dashboard-div">
      <div className="user-section">
        <h5 className="welcome-header">
          Welcome, {user ? user.name : "loading..."}!
        </h5>
        <p>Email: {user ? user.email : "loading..."} </p>
        {/* TODO: Show user Skills */}
        <SkillsSearchBar placeholder="Enter skills..." addSkills={addSkills} />
        <ul>
          <div className="skills-container">
            Skills:
            {user && skills.length > 0
              ? skills.map((skill, index) => (
                  // <li key={index}>{skill}</li>
                  <div key={index} className="skill-bubble">
                    {skill}
                    <span
                      className="remove-button"
                      onClick={() => removeSkill(skill)}
                    >
                      x
                    </span>
                  </div>
                ))
              : " No skills to show"}
          </div>
        </ul>
        <br />

        <DomainsSearchBar
          placeholder="Enter career paths..."
          addDomains={addDomains}
        />
        <ul>
          {/* TODO: Make skills editable - add/remove */}
          <div className="skills-container">
            Future Career Paths:
            {user && domains.length > 0
              ? domains.map((domain, index) => (
                  // <li key={index}>{skill}</li>
                  <div key={index} className="skill-bubble">
                    {domain}
                    <span
                      className="remove-button"
                      onClick={() => removeDomain(domain)}
                    >
                      x
                    </span>
                  </div>
                ))
              : " No Career Path Set"}
          </div>
        </ul>
        <Button buttonText="Save Profile" onClick={saveUser} />
        {isPopupVisible && <UserUpdatePopup closePopup={closePopup} />}
      </div>
    </div>
  );
};

export default UserProfile;
