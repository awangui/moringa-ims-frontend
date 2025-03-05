import React, { useState } from "react";
import login from "../styles/LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await fetch("http://172.236.2.18:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // setError(data.error || "Login failed");
        setError(data["error"] || "Login failed");
        alert(data["error"] || "Login failed");
      } else {
        localStorage.setItem("access_token", data["access_token"]);
        alert("Login successful");
        navigate("/"); // Navigate to the home page
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className={login.wrapper}>
      <div className={login.container} id="container">
        <Helmet>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
          />
        </Helmet>
        <div className={`${login["form-container"]} ${login["sign-in"]}`}>
          <form onSubmit={handleSubmit} autoComplete="off">
            <h1 className={login.myHeading}>Moringa's IMS</h1>
            <span>Login With Your Email & Password</span>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password input and icon container */}
            <div className={login.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <button type="submit" className="myBtn">
              Sign In
            </button>

            {/* <span>Forgot Password?</span> */}
          </form>
        </div>

        <div className={login["toggle-container"]}>
          <div className={login.toggle}>
            <div className={`${login["toggle-panel"]} ${login["toggle-right"]}`}>
              <img
                src="/images/moringa.png"
                alt="Moringa IMS Logo"
                width="100"
              />
              <h1 className={login.logo}>MORINGA</h1>
              <p>Discover • Grow • Transform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}