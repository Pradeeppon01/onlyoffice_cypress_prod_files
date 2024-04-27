import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import EmployeeNavbar from '../Components/EmployeeNavbar';
import { Avatar } from 'antd';
import '../Employeepage/emp.css';
import AdminNavbar from './AdminNav';
import * as moment from 'moment';
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
import AdminSidenav from '../Components/AdminSidenav';

const urlname = "https://api.sakthipress.i4ulabs.com";

function Admin() {
  const columns = [
    // ... existing columns ...
    {
      field: 'username',
      headerName: 'USERNAME',
      width: 120,
      editable: true,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'jobname',
      headerName: 'JOBNAME',
      width: 120,
      editable: true,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'machinename',
      headerName: 'MACHINENAME',
      width: 120,
      editable: true,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'STATUS',
      width: 100,
      editable: true,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 100,
      editable: true,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'date',
      headerName: 'DATE',
      width: 100,
      editable: true,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'time',
      headerName: 'TIME',
      width: 120,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => {
        const timeValue = params.value; // Get the original time value
        const formattedTime = moment(timeValue, 'HH:mm:ss').format('h:mm A'); // Format the time using moment.js
        return formattedTime;
      },
    },
    {
      field: 'images',
      headerName: 'PHOTOS',
      width: 180,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const myString = params.row.thumbnailimages;
        const myArray = JSON.parse(myString);

        return (
          <div>
            {myArray.length === 1 ? (
              <Avatar
                onClick={() => {
                  Setoriginalimages(myArray);
                  toggleShow();
                }}
                style={{ width: '40px', height: '40px', borderRadius: '2px' }}
                src={urlname + '/thumbnails/' + myArray[0]} // Modify the image source URL
              />
            ) : (
              myArray.map((value, index) => (
                <Avatar
                  onClick={() => {
                    Setoriginalimages(myArray);
                    toggleShow();
                  }}
                  key={index}
                  style={{ width: '40px', height: '40px', borderRadius: '2px', margin: '2px' }}
                  src={urlname + '/thumbnails/' + value} // Modify the image source URL
                />
              ))
            )}
          </div>
        );
      },
    },
  ];

  const [basicModal, setBasicModal] = useState(false);
  const [originalImages, setOriginalImages] = useState([]);
  let filenamesArray = [];

  const Setoriginalimages = (myArray) => {
    if (Array.isArray(myArray)) {
      filenamesArray = myArray.map((filename) => {
        return filename.substring("thumbnail_".length);
      });
    } else {
      filenamesArray = [myArray.substring("thumbnail_".length)];
    }

    setOriginalImages(filenamesArray);
  };

  const toggleShow = () => {
    setTimeout(() => {
      setBasicModal(!basicModal);
    }, 100);
  };

  useEffect(() => {
    if (basicModal) {
      document.body.classList.add('modal-open'); // Add CSS class to body when modal is open
    } else {
      document.body.classList.remove('modal-open'); // Remove CSS class from body when modal is closed
    }
  }, [basicModal]);

  const location = useLocation();
  const empusername = location.pathname.split('/')[2];
  const [alltasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get(`${urlname}/getallusertasks`);
      setAllTasks(res.data);
      setFilteredTasks(res.data); // Initialize filtered tasks with all tasks initially
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleFilter = () => {
    const filteredTasks = alltasks.filter((task) => {
      const taskDate = moment(task.date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD'); // Format task date to 'YYYY-MM-DD' format

      const startDateFormatted = moment(startDate, 'YYYY-MM-DD');
      const endDateFormatted = moment(endDate, 'YYYY-MM-DD');

      return moment(taskDate).isSameOrAfter(startDateFormatted, 'day') && moment(taskDate).isSameOrBefore(endDateFormatted, 'day');
    });

    setFilteredTasks(filteredTasks);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <div className='admin-container'>
      <AdminNavbar />
      <div style={{ display: 'flex', gap: '10px' }}>
        <div>
          <AdminSidenav />
        </div>
        <div className='taskbox'>
          <Box sx={{ height: 400, marginLeft: '10px', marginTop: '6px', width: '100%' }}>
            <div className='filter-container'>
              <label htmlFor='start-date'>From:</label>
              <input id='start-date' type='date' value={startDate} onChange={handleStartDateChange} />
              <label htmlFor='end-date'>To:</label>
              <input id='end-date' type='date' value={endDate} onChange={handleEndDateChange} />
              <button className='btn btn-dark' onClick={handleFilter}>
                Filter
              </button>
            </div>
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              getRowId={(row) => row.id}
              components={{
                Toolbar: () => {
                  return (
                    <GridToolbarContainer>
                      <GridToolbarExport />
                    </GridToolbarContainer>
                  );
                },
              }}
              pageSize={5}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </Box>
          <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
            <MDBModalDialog className='fullscreen-modal' style={{ maxWidth: '399px', maxHeight: '333px' }}>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>All Images</MDBModalTitle>
                  <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                  <h2>Images</h2>
                  {originalImages.map((value, index) => (
                    <img
                      key={index}
                      style={{ width: '100%', height: 'auto', borderRadius: '2px', marginBottom: '10px' }}
                      src={urlname + '/images/' + value}
                    />
                  ))}
                </MDBModalBody>
                <MDBModalFooter></MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </div>
      </div>
    </div>
  );
}

export default Admin;
