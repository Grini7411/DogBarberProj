import React, {useState} from 'react';
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import alertify from 'alertifyjs';


export default function Register(props) {
    const [registerObj, setRegisterObj] = useState({Username: "", Password: "", FullName: "", DogName: ""});

    const handleInputChange = (event) => {
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setRegisterObj({...registerObj, [name]: value})
    }

    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        const url = `http://localhost:5001/api/auth/register`;
        axios.post(url, registerObj, props.headersObj.headers).then(r => {
            if(r.status === 200){
                sessionStorage.setItem("clientId", r.data["id"]);
                props.setIsLoggedIn(true);
                alertify.notify('Registered Successfully', "success", "5", () => console.log("registered"))
            }
            else{
                alertify.error(r.data, "5",() => console.log('error'));
            }
        })
    }

    return (
        <Form onSubmit={handleRegisterSubmit}>
            <h3 className="text-center">Register To DogBarber</h3>

            <Form.Group controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control name="FullName" type="text" onChange={handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="userName">
                <Form.Label>UserName</Form.Label>
                <Form.Control name="Username" type="text" onChange={handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control name="Password" type="password" onChange={handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="dogName">
                <Form.Label>Dog Name</Form.Label>
                <Form.Control name="DogName" type="text" onChange={handleInputChange}/>
            </Form.Group>
            <Button className="btn btn-primary rounded-pill" type="submit">Register</Button>
        </Form>
    );
}
