import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MDBSelect } from 'mdb-react-ui-kit';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { json, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import EmployeeNavbar from '../Components/EmployeeNavbar';
import WebcamCapture from './Webcamera';
import { format } from 'date-fns';
import {} from 'geolocation';
import ReactLoading from 'react-loading';

const Addtask = () => {
  const [error, seterror] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewTasksEnabled, setViewTasksEnabled] = useState(true);
  const generateRandomId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const timestamp = new Date().getTime();
    return `${randomNumber}-${timestamp}`;
  };

  const generateCurrentDate = () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    return formattedDate;
  };

  const generateCurrentTime = () => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    return formattedTime;

    
  };

  const [randomId, setRandomId] = useState(generateRandomId());
  const location = useLocation();
  var empusername = decodeURIComponent(location.pathname.split('/')[2]);
  const [currLocation, setCurrLocation] = useState({});
  const [resultText, setResultText] = useState('');
  var urlname = 'https://api.sakthipress.i4ulabs.com';
  const [selectedStatus, setSelectedStatus] = useState('');

  const fileInput = useRef();
  const handleCapture = async (file, filename) => {
    if (
      tasks.jobid.length === 0 ||
      tasks.quantity.length === 0 ||
      tasks.jobname.length === 0 ||
      tasks.machinename.length === 0
    ) {
      seterror(true);
      toast.error('Please fill all the fields');
    } else {
      setIsLoading(true);
      const formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append('file', file[i]);
        formData.append('fileName', filename[i]);
      }
      try {
        const res = await axios.post(`${urlname}/upload`, formData);
        setResultText(res.data.message);
        fileInput.current.value = '';
        setTimeout(() => {
          setResultText('');
        }, 10);
      } catch (ex) {
        if (ex.response != undefined) {
          setResultText(ex.response.data.message);
        } else {
          setResultText('Server Error!');
        }
        setTimeout(() => {
          setResultText('');
        }, 10);
      }

      setTimeout(() => {
        try {
          axios.post(`${urlname}/addtasks`, tasks);
        } catch (err) {
          console.log(err);
          toast.error('Job not added');
        }
      }, 100);

      const newId = generateRandomId();
      setSelectedStatus('');
      settasks({
        ...tasks,
        id: newId,
        date: generateCurrentDate(),
        time: generateCurrentTime(),
        quantity: '',
        jobid: '',
        status:selectedStatus
      });
      const userDetails = {
        jobname: tasks.jobname,
        machinename: tasks.machinename,
      };
      const UserJobdeatils = JSON.stringify(userDetails);
      localStorage.setItem(empusername+'jobdetails', UserJobdeatils);
    

      setTimeout(() => {
        setIsLoading(false);
        toast.success('Your Job Added Successfully');
      }, 4000);
    }
  };



  const currentDate = new Date();
  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  const formattedTime = currentDate.toLocaleTimeString();
console.log(formattedDate)
  const getUserjobs = () => {
    if (localStorage.getItem(empusername+'jobdetails')) {
      const userDetailsString = localStorage.getItem(empusername+'jobdetails');
      const userDetails = JSON.parse(userDetailsString);
      return userDetails;
    } else {
      const userDetails = {
        jobname: 'Select jobname',
        machinename: 'Select machinename',
      };
      return userDetails;
    }
  };

  React.useEffect(() => {
    fetchAlltasks();
  }, []);

  const userDetails = getUserjobs();

  const [randomid, setrandomid] = useState('');
  const [jobname, setjobname] = useState('');
  const [machinename, setmachinename] = useState('');

  const [tasks, settasks] = useState({
    id: generateRandomId(),
    jobid: '',
    employeeusername: empusername,
    jobname: userDetails.jobname,
    machinename: userDetails.machinename,
    status: selectedStatus,
    quantity: '',
    date: formattedDate,
    time: formattedTime,
  });

  const handlechange = (e) => {
    settasks((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlejobname = (e) => {
    setjobname(e.target.value);
  };


  // Rest of the code...

  const handlestatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handlemachinename = (e) => {
    setmachinename(e.target.value);
  };


  //get all tasks
  const [alltasks, setalltasks] = useState([]);
  const [dropdownactive, setdropdownactive] = useState([]);
  const [alldropdown, setalldropdown] = useState([]);
  const [jobnamedropdown, setjobnamedropdown] = useState([]);
  const [machinenamedropdown, setmachinenamedropdown] = useState([]);
  const [id, setid] = useState();
  const fetchAlltasks = async () => {
    try {
      const res = await axios.get(`${urlname}/getusertasks/${empusername}`);
      setalltasks(res.data);
    } catch (err) {
      console.log(err);
    }

    //fetch taskstatus dropdowns
    const Status = 1;
    const dropdownname = 'jobstatusdropdown';
    try {
      const res = await axios.get(
        `${urlname}/getdropdownlists/${dropdownname}/${Status}`
      );
      setalldropdown(res.data);
    } catch (err) {
      console.log(err);
    }

    //fetch jobname dropdown

    const jobdropdownstatus = 1;
    const dropdownname2 = 'jobdropdown';
    try {
      const res = await axios.get(
        `${urlname}/getjobdropdown/${dropdownname2}/${jobdropdownstatus}`
      );
      setjobnamedropdown(res.data);
    } catch (err) {
      console.log(err);
    }
    //fetch machinenames dropdown

    const machinedropdownstatus = 1;
    const machinedropdownname = 'machinedropdown';
    try {
      const res = await axios.get(
        `${urlname}/getmachinename/${machinedropdownname}/${machinedropdownstatus}`
      );
      setmachinenamedropdown(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(tasks)
const[showCamera,setShowCamera] = useState(false)
  return (

    <div>
            <EmployeeNavbar
        empname={empusername}
        loading={isLoading}
        linkdisable={viewTasksEnabled}
      />
    
    <div className='add-task-container'>
      <div
        style={{
          display: 'block',
          width: 400,
          padding: 30,
        }}
      >
        <Form>
          <Form.Group style={{ marginTop: '7px' }}>
            <Form.Control
              type='text'
              name='jobid'
              onChange={handlechange}
              value={tasks.jobid}
              placeholder='jobid'
              required
            />
          </Form.Group>

          <select
            name='jobname'
            defaultValue='printing'
            style={{ marginTop: '7px' }}
            onChange={(e) => {
              handlechange(e);
              handlejobname(e);
            }}
            className='form-select'
          >
            {[
              userDetails.jobname,
              ...jobnamedropdown.map((item) => item.value),
            ]
              .filter(
                (item, index, self) => self.findIndex((i) => i === item) === index
              ) // Remove duplicates
              .map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>

          <select
            name='machinename'
            style={{ marginTop: '7px' }}
            onChange={(e) => {
              handlechange(e);
              handlemachinename(e);
            }}
            className='form-select'
          >
            {[
              userDetails.machinename,
              ...machinenamedropdown.map((item) => item.value),
            ]
              .filter(
                (item, index, self) => self.findIndex((i) => i === item) === index
              ) // Remove duplicates
              .map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>

          <Form.Group style={{ marginTop: '7px' }}>
        <Form.Label>Select Status</Form.Label>
        <RadioGroup
  aria-label="status"
  name="status"
  value={selectedStatus}
  onChange={(e) => {
    handlechange(e);
    handlestatus(e);
  }}
  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} // Add grid styles
>
  <div>
    {alldropdown.map((item, index) => {
      if (index % 2 === 0) {
        return (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio />}
            label={item.value}
          />
        );
      }
      return null;
    })}
  </div>
  <div>
    {alldropdown.map((item, index) => {
      if (index % 2 !== 0) {
        return (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio />}
            label={item.value}
          />
        );
      }
      return null;
    })}
  </div>
</RadioGroup>

      </Form.Group>


          <Form.Group style={{ marginTop: '7px' }}>
            <Form.Control
              type='text'
              name='quantity'
              value={tasks.quantity}
              onChange={handlechange}
              placeholder='Enter the Quantity'
            />
          </Form.Group>
        </Form>
        {showCamera && (
        <Form.Group>
        <Form.Label>Take Photos</Form.Label>
        <WebcamCapture
          disabled={isLoading}
          onCapture={handleCapture}
          id={tasks.id}
        />
      </Form.Group>
          )}

        {showCamera ? (
          <Button  style={{ marginTop: '10px',marginLeft:"-15px" }}
            variant='primary'
            onClick={() => setShowCamera(false)}
            disabled={isLoading}
          >
            Close Camera
          </Button>
        ) : (
          <Button  style={{ marginTop: '7px' }}
            variant='primary'
            onClick={() => setShowCamera(true)}
            disabled={isLoading}
          >
            Show Camera
          </Button>
        )}

{!showCamera && (
            <Button  style={{ marginTop: '7px' ,marginLeft:"8px"}}
            variant='primary'
            onClick={handleCapture}
            disabled={isLoading}
          >submit</Button>
          )}
            


        {isLoading && (
          <div className='loading-overlay'>
            <ReactLoading type='spin' color='#000' height={50} width={50} />
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Addtask;
