import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNav';
import AdminSidenav from '../Components/AdminSidenav';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Form from 'react-bootstrap/Form';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

const urlname = "https://api.sakthipress.i4ulabs.com";

function Addmachines() {
  const [basicModal, setBasicModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [dropdownName, setDropdownName] = useState('jobdropdown');
  const [dropdownValue, setDropdownValue] = useState('');
  const [dropdownStatus, setDropdownStatus] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleShow = () => {
    setTimeout(() => {
      setBasicModal(!basicModal);
    }, 100);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'dropdownname', headerName: 'Dropdown Name', width: 130 },
    { field: 'value', headerName: 'Value', width: 130 },
    {
      field: 'dropdownstatus',
      headerName: 'Dropdown Status',
      width: 130,
      renderCell: (params) => (
        <span>{params.value === 1 ? 'Enabled' : 'Disabled'}</span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div>
          <i  onClick={() => handleEdit(params.row)} style={{fontSize:"30px",color:"blue",cursor:"pointer"}} class="ri-pencil-fill"></i>
          <i style={{fontSize:"30px",color:'red',cursor:"pointer"}} class="ri-delete-bin-fill" onClick={() => handleDelete(params.row.id)}></i>
        </div>
      ),
    },
  ];

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${urlname}/dropdownconfigurations`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const addUser = async () => {
    try {
      const randomId = Math.floor(Math.random() * 1000) + 1; // Generate a random ID
      await axios.post(`${urlname}/dropdownconfigurations`, {
        id: randomId,
        dropdownname: dropdownName,
        value: dropdownValue,
        dropdownstatus: dropdownStatus,
      });
      fetchUsers();
      clearForm();
      setOpenPopup(false);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(`${urlname}/dropdownconfigurations/${editId}`, {
        dropdownname: dropdownName,
        value: dropdownValue,
        dropdownstatus: dropdownStatus,
      });
      fetchUsers();
      clearForm();
      setIsEditing(false);
      setOpenPopup(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${urlname}/dropdownconfigurations/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const clearForm = () => {
    setDropdownName('jobdropdown');
    setDropdownValue('');
    setDropdownStatus(1);
    setEditId('');
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditId(user.id);
    setDropdownName(user.dropdownname);
    setDropdownValue(user.value);
    setDropdownStatus(user.dropdownstatus);
    setOpenPopup(true);
  };

  const handleDelete = (id) => {
    deleteUser(id);
  };



  return (
    <div>
      <AdminNavbar />
      <div style={{ display: 'flex', gap: '60px' }}>
        <div style={{ width: '200px' }}>
          <AdminSidenav />
        </div>

        <div style={{ marginTop: '30px' }}>
          <button className='btn btn-primary' onClick={() => setOpenPopup(true)}>
            Add Details
          </button>

          <div style={{ height: 400, width: '100%', marginTop: '10px' }}>
            <DataGrid rows={users} columns={columns} pageSize={5} />
          </div>
        </div>



        

        <MDBModal
          tabIndex='-1'
          show={openPopup}
          backdrop={true}
          toggle={() => setOpenPopup(false)}
          staticBackdrop
        >
          <MDBModalDialog>
            <MDBModalContent onClick={(e) => e.stopPropagation()}>
              <MDBModalHeader>
                <MDBModalTitle>{isEditing ? 'Edit Details' : 'Add Details'}</MDBModalTitle>
              </MDBModalHeader>
              <MDBModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isEditing) {
                      updateUser();
                    } else {
                      addUser();
                    }
                  }}
                >
    

                  <Form.Group style={{ marginTop: '7px' }}>
                    <Form.Label>Dropdown Name</Form.Label>
                    <Form.Select
                      value={dropdownName}
                      onChange={(e) => setDropdownName(e.target.value)}
                    >
                      <option value='jobdropdown'>Job Dropdown</option>
                      <option value='machinedropdown'>Machine Dropdown</option>
                      <option value='jobstatusdropdown'>Job Status Dropdown</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group style={{ marginTop: '7px' }}>
                    <Form.Control
                      type='text'
                      placeholder='Value'
                      value={dropdownValue}
                      onChange={(e) => setDropdownValue(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginTop: '7px' }}>
                    <Form.Label>Dropdown Status</Form.Label>
                    <Form.Select
                      value={dropdownStatus}
                      onChange={(e) => setDropdownStatus(Number(e.target.value))}
                    >
                      <option value={1}>Enable</option>
                      <option value={0}>Disable</option>
                    </Form.Select>
                  </Form.Group>

                  <button style={{ marginTop: '6px' }} className='btn btn-primary' type='submit'>
                    {isEditing ? 'Update User' : 'Add User'}
                  </button>
                  <button
                    className='btn btn-danger'
                    style={{ marginTop: '6px', marginLeft: '10px' }}
                    type='button'
                    onClick={() => {
                      clearForm();
                      setOpenPopup(false);
                    }}
                  >
                    Cancel
                  </button>
                </form>
              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </div>
    </div>
  );
}

export default Addmachines;
