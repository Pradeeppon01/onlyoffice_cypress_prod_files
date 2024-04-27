import React, { useState, useEffect } from 'react';
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
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import EmployeeNavbar from '../Components/EmployeeNavbar';
import { Avatar } from 'antd';
import '../Employeepage/emp.css';
import { DataGrid } from '@mui/x-data-grid';

const urlname = 'https://api.sakthipress.i4ulabs.com';

function Viewtask() {
  const [basicModal, setBasicModal] = useState(false);
  const [originalImages, setOriginalImages] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);

  const Setoriginalimages = (myArray) => {
    if (Array.isArray(myArray)) {
      const filenamesArray = myArray.map((filename) => {
        return filename.substring("thumbnail_".length);
      });
      setOriginalImages(filenamesArray);
    } else {
      const filename = myArray.substring("thumbnail_".length);
      setOriginalImages([filename]);
    }
  };

  const toggleShow = () => {
    setTimeout(() => {
      setBasicModal(!basicModal);
    }, 100);
  };

  const location = useLocation();
  const empusername = location.pathname.split('/')[2];
  const [alltasks, setAllTasks] = useState([]);

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get(`${urlname}/getusertasks/${empusername}`);
      setAllTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const columns = [
    { field: 'jobname', headerName: 'Job Name', width: 150 },
    { field: 'machinename', headerName: 'Machine Name', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'quantity', headerName: 'Total Quantity', width: 150 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'time', headerName: 'Time', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <MDBBtn
          size="sm"
          onClick={() => {
            Setoriginalimages(JSON.parse(params.row.thumbnailimages));
            toggleShow();
          }}
        >
          View Images
        </MDBBtn>
      ),
    },
  ];

 // ...

return (
  <div className='task' style={{ background: 'white', minHeight: '100vh',color:"white" }}>
    <EmployeeNavbar empname={empusername} />
    <div className='taskbox' style={{ width: '70%' }}>
      {!isMobileView ? (
        <DataGrid
          rows={alltasks}
          columns={columns}
          autoHeight
          disableColumnMenu
          disableSelectionOnClick
          hideFooter
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '17px',
            padding: '20px',
          }}
        >
          <div style={{display:'flex',flexDirection:"column",alignItems:'center'}}>
          {alltasks.map((task) => (
            <div
              key={task.id}
              style={{ background: 'white', padding: '10px', borderRadius: '2px',color:"black",width:"300px" }}
            >
              <div style={{ textAlign: 'center' }}>
                <div className='bg-primary' style={{ padding: '10px' }}>
                  <h5>Job Name: {task.jobname}</h5>
                </div>
                <p>Machine Name: {task.machinename}</p>
                <p>Status: {task.status}</p>
                <p>Total Quantity: {task.quantity}</p>
                <p>Date: {task.date}</p>
                <p>Time: {task.time}</p>
              </div>
              <button
                className='btn btn-dark'
                onClick={() => {
                  Setoriginalimages(JSON.parse(task.thumbnailimages));
                  toggleShow();
                }}
                style={{width:"200px",marginLeft:"50px"}}
              >
                View Images
              </button>
            </div>
          ))}
          </div>
        </div>
      )}
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
                    alt={`Image ${index + 1}`}
                  />
                ))}
              </MDBModalBody>
              <MDBModalFooter></MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
    </div>
  </div>
);



}

export default Viewtask;
