import './App.css';
import Login from "./Components/Login";
import React, {useState} from "react";
import {Route, Switch} from "react-router-dom";

import {Button, Container, Nav, Navbar} from "react-bootstrap";
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
    const [user, setUser] = useState('');
    let logout = () => {
        setIsLoggedIn(false);
        setUser('');

    };
    return(
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand  >
                        <img
                            alt=""
                            src="https://img.icons8.com/pastel-glyph/2x/dog--v2.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top bg-light "
                        />{' '}
                        DogBarber
                    </Navbar.Brand>
                    <Nav className="ml-auto">
                        {isLoggedIn && <Nav.Item>
                            <Button variant="link" className="btn btn-link pr-5" onClick={logout}>Logout</Button>
                        </Nav.Item>}
                        <Nav.Item className="pr-5 pt-2 text-light">Hello {user || "Guest!"}</Nav.Item>

                    </Nav>
                </Navbar>
                <Container className="login_container py-5">
                <Switch>
                    <Route path="/" exact>
                        {!isLoggedIn && <Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} headersObj={axiosHeaders}/>}
                    </Route>
                    <Route path="/register">
                        {!isLoggedIn && <Register setIsLoggedIn={setIsLoggedIn} headersObj={axiosHeaders}/>}
                    </Route>

                    <Route path="*">
                        <Error/>
                    </Route>
                </Switch>
                {isLoggedIn && <AppointmentList headersObj={axiosHeaders}/>}
            </Container>
            </div>
            );
}

const Error = () => {
    return (
        <h1 className="text-center">This is not the page you are looking for</h1>
    )
}



