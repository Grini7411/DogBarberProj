import './App.css';
import Login from "./Components/Login";
import React, {useState} from "react";
import {Route, Switch} from "react-router-dom";

import {Container} from "react-bootstrap";
import AppointmentList from "./Components/AppointmentList";
import Register from "./Components/Register";
export default App;


const axiosHeaders = {
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
        return(

            <Container className="login_container py-5">
                <Switch>
                    <Route path="/" exact>
                        {!isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} headersObj={axiosHeaders}/>}
                    </Route>
                    <Route path="/register">
                        {!isLoggedIn && <Register setIsLoggedIn={setIsLoggedIn} headersObj={axiosHeaders}/>}
                    </Route>

                    <Route path="*">
                        <Error/>
                    </Route>
                </Switch>
                {isLoggedIn && <AppointmentList headersObj={axiosHeaders}/>}
            </Container>);
}

const Error = () => {
    return (
        <h1 className="text-center">This is not the page you are looking for</h1>
    )
}



