/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

const weather = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [state, setState] = useState("weather");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [loggedin, setLoggedin] = useState(false);
  const [userID, setUserID] = useState(0);
  const [history, setHistory] = useState([]);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const loginButton = () => {
    setState("login");
  };

  const registerButton = () => {
    setState("register");
  };

  const weatherButton = () => {
    setState("weather");
  };

  const submitRegister = () => {
    if (
      registerEmail !== "" ||
      registerPassword !== "" ||
      registerUsername !== ""
    ) {
      axios
        .post("http://localhost:8080/users", {
          email: registerEmail,
          password: registerPassword,
          username: registerUsername,
        })
        .then((reponse) => {
          console.log(reponse);
          setState("weather");
        });
    }
  };

  const submitLogin = async () => {
    const user = await axios.get(`http://localhost:8080/users/${loginEmail}`);
    if (user) {
      if (user.data.results[0].password === loginPassword) {
        setLoggedin(true);
        setUserID(user.data.results[0].ID);
        setState("weather");
      }
    }
  };

  useEffect(() => {
    if (loggedin) {
      axios.get(`http://localhost:8080/history/${userID}`).then((response) => {
        console.log(response);
        console.log(response.data.history);
        setHistory(response.data.history);
        console.log(history);
        forceUpdate();
      });
    }
  });

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`;

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
      });
      setLocation("");
      axios
        .post("http://localhost:8080/history", {
          location: location,
          userID: userID,
        })
        .then((reponse) => {
          console.log(reponse);
        });
      const his = history;
      his.push({
        location: location,
      });
      setHistory(his);
    }
  };

  return (
    <div className="app">
      <div className="buttonsContainer">
        <Button className="p-button-text" onClick={loginButton} label="Login" />
        <Button
          className="p-button-text"
          onClick={registerButton}
          label="Register"
        />
        <Button
          className="p-button-text"
          onClick={weatherButton}
          label="Weather"
        />
      </div>
      {state === "weather" ? (
        <>
          <div className="search">
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onKeyPress={searchLocation}
              placeholder="Enter Location"
              type="text"
            />
          </div>
          <div className="container">
            <div className="top">
              <div className="location">
                <p>{data.name}</p>
              </div>
              <div className="temp">
                {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
              </div>
              <div className="description">
                {data.weather ? <p>{data.weather[0].main}</p> : null}
              </div>
            </div>

            {data.name !== undefined && (
              <div className="bottom">
                <div className="feels">
                  {data.main ? (
                    <p className="bold">{data.main.feels_like.toFixed()}°F</p>
                  ) : null}
                  <p>Feels Like</p>
                </div>
                <div className="humidity">
                  {data.main ? (
                    <p className="bold">{data.main.humidity}%</p>
                  ) : null}
                  <p>Humidity</p>
                </div>
                <div className="wind">
                  {data.wind ? (
                    <p className="bold">{data.wind.speed.toFixed()} MPH</p>
                  ) : null}
                  <p>Wind Speed</p>
                </div>
              </div>
            )}
          </div>
          {loggedin === true ? (
            <>
              <div className="historyContainer">History</div>
              {console.log(history)}
              {history.map((history, index) => (
                <div>
                  <div>Location: {history.location}</div>
                </div>
              ))}
            </>
          ) : null}
        </>
      ) : (
        <>
          {state === "login" ? (
            <div className="loginContainer">
              <div className="form">
                <div className="header">Login</div>
                <div>
                  <label className="label" htmlFor="Email">
                    Email
                  </label>
                  <div className="inputText">
                    <InputText
                      className="textLabel"
                      type="text"
                      value={loginEmail}
                      onChange={(evt) => setLoginEmail(evt.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="Password">
                    Password
                  </label>
                  <div className="inputText">
                    <Password
                      type="text"
                      value={loginPassword}
                      onChange={(evt) => setLoginPassword(evt.target.value)}
                    />
                  </div>
                </div>
                <div className="centerButton">
                  <Button
                    className="p-button-raised p-button-secondary"
                    onClick={submitLogin}
                    label="Login"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="loginContainer">
                <div className="form">
                  <div className="header">Register</div>
                  <div>
                    <label className="label" htmlFor="Email">
                      Email
                    </label>
                    <div className="inputText">
                      <InputText
                        className="textLabel"
                        type="text"
                        value={registerEmail}
                        onChange={(evt) => setRegisterEmail(evt.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="Password">
                      Password
                    </label>
                    <div className="inputText">
                      <Password
                        type="text"
                        value={registerPassword}
                        onChange={(evt) =>
                          setRegisterPassword(evt.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="Username">
                      Username
                    </label>
                    <div className="inputText">
                      <InputText
                        type="text"
                        value={registerUsername}
                        onChange={(evt) =>
                          setRegisterUsername(evt.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="centerButton">
                    <Button
                      className="p-button-raised p-button-secondary"
                      onClick={submitRegister}
                      label="Register"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default weather;
