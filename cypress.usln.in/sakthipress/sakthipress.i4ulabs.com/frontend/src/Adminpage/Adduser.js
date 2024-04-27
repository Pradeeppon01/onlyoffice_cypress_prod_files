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

function Adduser() {
  const [basicModal, setBasicModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [id, setid] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [mobilenumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userStatus, setUserStatus] = useState('');
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
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'mobilenumber', headerName: 'Mobile Number', width: 130 },
    { field: 'password', headerName: 'Password', width: 130 },
    {
      field: 'userstatus',
      headerName: 'User Status',
      width: 150,
   
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div>
          <i onClick={() => handleEdit(params.row)} style={{ fontSize: '30px', color: 'blue', cursor: 'pointer' }} class="ri-pencil-fill"></i>
          <i style={{ fontSize: '30px', color: 'red', cursor: 'pointer' }} class="ri-delete-bin-fill" onClick={() => handleDelete(params.row.id)}></i>
        </div>
      ),
    },
  ];

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${urlname}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const addUser = async () => {
    const id = Math.floor(Math.random() * 1000) + 1;
    try {
      await axios.post(`${urlname}/users`, {
        id,
        name,
        username,
        mobilenumber,
        password,
        userstatus: userStatus,
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
      await axios.put(`${urlname}/users/${editId}`, {
        name,
        username,
        mobilenumber,
        password,
        userstatus: userStatus,
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
      await axios.delete(`${urlname}/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const clearForm = () => {
    setName('');
    setUsername('');
    setMobileNumber('');
    setPassword('');
    setUserStatus('');
    setEditId('');
  };

  const handleUserStatusChange = (id, status) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, userstatus: status } : user
    );
    setUsers(updatedUsers);
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditId(user.id);
    setName(user.name);
    setUsername(user.username);
    setMobileNumber(user.mobilenumber || '');
    setPassword(user.password);
    setUserStatus(user.userstatus || '');
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
          <button className='btn btn-primary' onClick={() => setOpenPopup(true)}>Add User</button>

          <div style={{ height: 400, width: '100%', marginTop: '10px' }}>
            <DataGrid rows={users} columns={columns} pageSize={5} />
          </div>
        </div>

        <MDBModal tabIndex="-1" show={openPopup} backdrop={true} toggle={() => setOpenPopup(false)}>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>{isEditing ? 'Edit User' : 'Add User'}</MDBModalTitle>
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
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginTop: '7px' }}>
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginTop: '7px' }}>
                    <Form.Control
                      type="text"
                      placeholder="Mobile Number"
                      value={mobilenumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginTop: '7px' }}>
                    <Form.Control
                      type="text"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group style={{ marginTop: '7px' }}>
                    <Form.Control
                      as="select"
                      value={userStatus}
                      onChange={(e) => setUserStatus(e.target.value)}
                    >
                      <option value="">Select User Status</option>
                      <option value="enable">Enable</option>
                      <option value="disable">Disable</option>
                    </Form.Control>
                  </Form.Group>

                  <button style={{ marginTop: '6px' }} className='btn btn-primary' type="submit">
                    {isEditing ? 'Update User' : 'Add User'}
                  </button>
                  <button
                    className='btn btn-danger'
                    style={{ marginTop: '6px', marginLeft: '10px' }}
                    type="button"
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

export default Adduser;
