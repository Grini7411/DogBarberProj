import React, {useState} from 'react';
import {Button, Form, Container, Col, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from "axios";
import alertify from 'alertifyjs';


function Login(props) {

    const [loginFormResults, setLoginFormResults] = useState({Username: "", Password: ""});

    const handleInputChange = (event) => {
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setLoginFormResults({...loginFormResults, [name]: value})
    }

     const loginSubmit = (event) => {
        event.preventDefault();
        const url = `http://localhost:5001/api/auth/login`;
        axios.post(url, loginFormResults, props.headersObj.headers).then(r => {
            if (r.data["success"]){
                alertify.notify("Logged-in successfully!","success","5", () => console.log('yay!'));
                sessionStorage.setItem("clientId", r.data["clientId"]["id"]);
                sessionStorage.setItem("token", r.data.token);
                props.setIsLoggedIn(true);
            }
        })
    }

    return (

            <Form onSubmit={loginSubmit}>
                <h3 className="text-center">Sign In to DogBarber!</h3>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form.Group controlId="username">
                            <Form.Label>userName</Form.Label>
                            <Form.Control type="text"  name="Username" onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="Password" onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <div className="text-center">
                    <Button variant="primary" className="btn btn-primary rounded-pill" type="submit">Submit</Button>
                    <Link to="/register" className="btn btn-success rounded-pill ml-3">Register</Link>
                </div>
            </Form>
    );
}



export default Login;
