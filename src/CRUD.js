import React, {useState, useEffect, Fragment} from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CRUD = () => {
    
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState('');
    const [age, setAge] = useState('');

    const [editId, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState(''); 
    
    const [data, setData] = useState([]);
    
    useEffect(()=>{
        getData();
    }, [])

    const getData = () => {
        axios.get('https://localhost:7294/api/Employee')
        .then((result) => {
            setData(result.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    
    const handleEdit = (id) => {
        handleShow(); 
        axios.get(`https://localhost:7294/api/Employee/${id}`)
        .then((result) => {
            setEditName(result.data.name);
            setEditAge(result.data.age);
            setEditId(id);
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    
    const handleDelete = (id) => {
        if(window.confirm('sure to delete?') == true){
            axios.delete(`https://localhost:7294/api/Employee/${id}`)
            .then((result) => {
                if(result.status === 200){
                    toast.success('Employee has been deleted');
                    getData();
                }
            }).catch((error) => {
                toast.error(error);
            })
        }
    }
    
    const handleUpdate = () => {
        const url = `https://localhost:7294/api/Employee/${editId}`;
        const data = {
            "id": editId,
            "name": editName,
            "age": editAge
        }

        axios.put(url, data)
        .then((result) => {
            handleClose();
            getData();
            clear();
            toast.success('Employee has been updated');
        }).catch((error) => {
           toast.error(error);
        })
    }

    const handleSave = () => {
         const url = "https://localhost:7294/api/Employee";
         const data = {
             "name": name,
             "age": age
         }

         axios.post(url, data)
         .then((result) => {
             getData();
             clear();
             toast.success('Employee has been added');
         }).catch((error) => {
            toast.error(error);
         })
    }

    const clear = () => {
        setName('');
        setAge('');
        setEditName('');
        setEditAge(''); 
        //setEditId('');
    }
    
    
    return(
        <Fragment>
            <ToastContainer/>
            <Container>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)}/>
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={() => handleSave()}>Submit</button>
                    </Col>
                </Row>

            </Container>
        
        <Table striped bordered hover>
        <thead>
        <tr>
        <th>#</th>
        <th>Name</th>
        <th>Age</th>
        <th>Photo</th>
        </tr>
        </thead>
        <tbody>
        {
            data && data.length > 0 ?
            data.map((item, index)=>{
                return(
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>{item.photo}</td>
                    <td colSpan={2}>
                        <button className="btn btn-primary" onClick={()=>{handleEdit(item.id)}}>Edit</button> &nbsp;
                        <button className="btn btn-danger" onClick={()=>{handleDelete(item.id)}}>Delete</button>
                    </td>
                    </tr>
                    )
                })
                : 
                'Loading...'
            }
            
            
            </tbody>
            </Table>
            
            <Modal show={show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
            <Modal.Title>Modify / Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Name" value={editName} onChange={(e) => setEditName(e.target.value)}/>
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Age" value={editAge} onChange={(e) => setEditAge(e.target.value)}/>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
                Save Changes
            </Button>
            </Modal.Footer>
            </Modal>
            </Fragment>        
            
            )
        }
        
        export default CRUD;