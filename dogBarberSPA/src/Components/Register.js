import React, {useState} from 'react';
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import alertify from 'alertifyjs';


export default function Register(props) {
    const [registerObj, setRegisterObj] = useState({Username: "", Password: "", FullName: "", DogName: ""});
    const [validated, setValidated] = useState(false);
    const handleInputChange = (event) => {
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setRegisterObj({...registerObj, [name]: value})
    }

    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            alertify.error("One or more required field missing!", "5",() => console.log('not valid!'))
            return;
        }
        setValidated(true);
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
        <Form validated={validated} onSubmit={handleRegisterSubmit}>
            <h3 className="text-center">Register To DogBarber</h3>

            <Form.Group controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control name="FullName" type="text" required onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="userName">
                <Form.Label>UserName</Form.Label>
                <Form.Control name="Username" type="text" required onChange={handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control name="Password" type="password" required onChange={handleInputChange}/>
            </Form.Group>
            <Form.Group controlId="dogName">
                <Form.Label>Dog Name</Form.Label>
                <Form.Control name="DogName" type="text" required onChange={handleInputChange}/>
            </Form.Group>
            <Button className="btn btn-primary rounded-pill" type="submit">Register</Button>
        {/*</Form>*/}
    );
}
