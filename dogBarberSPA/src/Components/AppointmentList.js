import React, {useEffect, useState} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from "axios";
import Modal from 'react-modal';
import {Button, Card, Form, Spinner} from "react-bootstrap";
import DateTimePicker from 'react-datetime-picker';
import alertify from 'alertifyjs';


const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'

    }
}
const addModalStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        width                 : '30rem'

    }
}

Modal.setAppElement(document.getElementById('root'));

export default function AppointmentList(props) {
    const [appointments, setAppointments] = useState([]);
    const [client, setClient] = useState({});
    const [row, setRow] = useState({});
    const [dateUpdateValue, onChangedDateUpdateValue] = useState(new Date());
    const [value, onChange] = useState(new Date());
    const [isAptUpdated, setIsUpdated] = useState(false);
    const [completeGet, setCompleteGet] = useState(false);



    const [modalIsOpen, setIsOpen] = useState(false);
    const openEditModal = () => setIsOpen(true);
    const closeEditModal = () => setIsOpen(false);

    const [modalAddIsOpen, setAddIsOpen] = useState(false);
    const openAddModal = () => setAddIsOpen(true);
    const closeAddModal = () => {setAddIsOpen(false)};
    const formatDateTime = (date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleString();
    };


    function handleValidation() {
        return false;
    }



    useEffect(() => {
        setCompleteGet(false);
        let url = "http://localhost:5001/api/appointment";
        axios.get(url)
            .then(r => {
                let editedData = [...r.data].map(el => {
                    el["fullName"] = el["client"]["fullName"];
                    el["created"] = formatDateTime(el["created"]);
                    el["date"] = formatDateTime(el["date"]);
                    delete el["client"];
                    return el;
                })
                setAppointments(editedData);
                setCompleteGet(true);
            })
        },[isAptUpdated, value])
    const columns =[
        {dataField: "id", text: "Id", sort: true},
        {dataField: "fullName", text: "Full Name"},
        {dataField: "date", text: "Date", sort: true},
        {dataField: "created", text: "Created", sort: true}
    ]

    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            e.preventDefault();
            setRow(row);
            if (row["clientId"] !== +sessionStorage.getItem("clientId")){
                alertify.notify("You don't have the permissions to edit this appointment", "warning", "5", () => console.log("no permissions"));
                return;
            }
            const config = {
                headers: {
                    ...props.headersObj.headers,
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }
            axios.get(`http://localhost:5001/api/client/${row.clientId}`,
                config)
                .then((r) => {
                    openEditModal();
                    setClient(r.data);
                    onChangedDateUpdateValue(new Date(row["date"]))
                })
        }
    };

    const handleSubmitAddForm = (event) => {
        event.preventDefault();
        const url = "http://localhost:5001/api/appointment/new";
        const dataJSON = {"Date": value.toLocaleString(), "ClientId":+sessionStorage.getItem("clientId")};

        axios.post(url,dataJSON, props.headersObj).then(r => {
            if (r.data.success) {
                alertify.notify("Appointment added successfully!", "success", "5", () => console.log('yay!'));
                setIsUpdated(true);
                closeAddModal();
            }
        });
    }

    const handleUpdateFormSubmit = (event) => {
        event.preventDefault();
        let url = `http://localhost:5001/api/appointment/update/${row["id"]}`;
        const dataJson = {
            "ClientId":+sessionStorage.getItem("clientId"),
            "NewDate": dateUpdateValue.toLocaleString()
        }
        axios.put(url, dataJson).then(r => {
            if (r.data.success){
                closeEditModal();
                setIsUpdated(true);
                alertify.notify(r.data["msg"], "success", "5", () => console.log("Updated"));
            }
            else {
                alertify.notify("Something went wrong!", "danger", "5", () => {console.log(r.data.err)});
            }
        });
    }

    const deleteAppointment = (event) => {
        event.preventDefault();
        setCompleteGet(false);
        const url = `http://localhost:5001/api/appointment/delete/${row.id}`;
        axios.delete(url).then((r) => {
            if (r.data.success){
                closeEditModal();
                setIsUpdated(true);
                alertify.notify(r.data["msg"], "success", "5", () => console.log("deleted"));
            }
        })
    }

    return (
        <div>
            <Button variant="primary" className="btn btn-primary rounded-pill mb-3" onClick={openAddModal}>Add Appointment</Button>
            <div>
                {completeGet && <BootstrapTable keyField="id" hover data={appointments} columns={columns} rowEvents={rowEvents}/>}
                <Spinner animation="border" variant="primary" size="lg" hidden={completeGet} role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>

            <Modal isOpen={modalIsOpen}
                   onRequestClose={closeEditModal}
                   style={customStyles}
                   contentLabel="Edit Appointment Modal">
                <Card>
                    <Card.Header>Update Appointment</Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleUpdateFormSubmit}>
                            <Form.Row>
                                <Form.Group>
                                    <Form.Label>Appointment Id</Form.Label>
                                    <Form.Control disabled="disabled" value={row && row["id"]}/>
                                </Form.Group>
                                <Form.Group className="ml-3">
                                    <Form.Label>Client Name</Form.Label>
                                    <Form.Control disabled="disabled" value={client && client["fullName"]}/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group>
                                    <Form.Label>Dog Name</Form.Label>
                                    <Form.Control disabled="disabled" value={client && client["dogName"]}/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group>
                                    <Form.Label>Update Requested Appointment</Form.Label>
                                    <DateTimePicker onChange={onChangedDateUpdateValue}
                                                    value={dateUpdateValue}/>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Button variant="success" className="btn btn-success rounded-pill" type="submit">Update Appointment</Button>
                                <Button variant="danger" className="btn btn-danger rounded-pill ml-3" onClick={deleteAppointment}>Delete</Button>
                                <Button variant="outline-primary" className="btn btn-outline-primary-primary rounded-pill ml-3" onClick={closeEditModal}>Close</Button>
                            </Form.Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Modal>

            <Modal isOpen={modalAddIsOpen}
                   onRequestClose={closeAddModal}
                   style={addModalStyles}
                   contentLabel="Add Appointment Modal">
                <Card>
                    <Card.Header>Add New Appointment</Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmitAddForm}>
                            <Form.Row>
                                <Form.Group>
                                    <DateTimePicker name="dateToAdd" onChange={onChange} value={value} />
                                    <pre className="text-muted">Add Requested Date and time</pre>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Button variant="primary" className="btn btn-primary rounded-pill" type="submit">Add Appointment</Button>
                                <Button variant="outline-primary" className="btn btn-outline-primary rounded-pill ml-3" onClick={closeAddModal}>Close</Button>
                            </Form.Row>
                        </Form>
                    </Card.Body>
                </Card>


            </Modal>
        </div>
    );

}

