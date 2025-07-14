import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { homepageHeading, homepageTagline } from "../../utils/Boilerplate.js";

const Home = () => {
  const navigate = useNavigate();

  const redirect = (redirectTo) => {
    if (redirectTo === "signup") navigate("/signup");
    else if (redirectTo === "login") navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-left">
        <h1 className="home-heading">
          {homepageHeading()} <br />
          <span className="highlight">Ayuda</span>
        </h1>
        <p className="home-subtext">
          {homepageTagline()}
        </p>
        <div className="home-buttons">
          <button className="btn btn-primary" onClick={() => redirect("signup")}>
            Get Started →
          </button>
          <button className="btn btn-outline" onClick={() => {}}>
            Learn More
          </button>
        </div>
      </div>
      <div className="home-right">
        <img src="/ayuda_panda_gif.gif" alt="Ayuda Logo" className="home-gif" />
      </div>
    </div>
  );
};

export default Home;
