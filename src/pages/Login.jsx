import React from "react";
import login from "../styles/LoginPage.module.css";

export default function Login(){
  return (
    <div className={login['wrapper']}>
        <div className={login["container"]} id="container">
            <div className={`${login["form-container"]} ${login["sign-in"]}`}>
                <form>
                <h1 className={login["myHeading"]}>Moringa's IMS</h1>
                <span>Login With Your Email & Password</span>
                <input type="email" placeholder="Enter E-mail" />
                <input type="password" placeholder="Enter Password" />
                <button className="myBtn">Sign In</button>
                </form>
            </div>

            <div className={login["toggle-container"]}>
                <div className={login["toggle"]}>
                <div className={`${login["toggle-panel"]} ${login["toggle-right"]}`}>
                    <img src="/images/moringa.png" alt="Moringa IMS Logo" width="100" />
                    <h1 className={login["logo"]}>MORINGA</h1>
                    <p>Discover • Grow • Transform</p>
                </div>
                </div>
            </div>
        </div>
    </div>
  );
};
