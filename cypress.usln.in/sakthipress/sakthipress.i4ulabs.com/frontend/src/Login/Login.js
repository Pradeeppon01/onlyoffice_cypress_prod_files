import React, { useState, useEffect } from 'react';
import { MDBInput, MDBCheckbox, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../Employeepage/emp.css';
import { useNavigate } from 'react-router-dom';

import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBCollapse
} from 'mdb-react-ui-kit';

const urlname = 'https://api.sakthipress.i4ulabs.com';

function Login() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [username, setusername] = useState('');

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.log(error);
            setLocationError(true);
          }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
        setLocationError(true);
      }
    };

    getLocation();
  }, []);

  const [values, setValues] = useState({
    number: '',
    password: '',
    location: {},
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const formSubmitter = (event) => {
    event.preventDefault();
    const adminname = 'admin@gmail.com';
    const adminpass = '1234';
    if (values.number === adminname && values.password === adminpass) {
      toast.success('Login successful');
      localStorage.setItem(values.number + '*', true);
      navigate(`/admin/${values.number}`);
    } else {
      axios
        .post(`${urlname}/login`, values)
        .then((res) => {
          if (res.data.Login) {

            localStorage.setItem(res.data.data[0].username + '*', true);
            localStorage.setItem(res.data.data[0].username + '*' + 'location:', JSON.stringify([latitude, longitude]));
            toast.success('Login successful');
            navigate(`/addtask/${res.data.data[0].username}`);
          } else {
            toast.error('Wrong number or password');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    const locationData = {
      latitude,
      longitude,
    };

    setValues((prev) => ({ ...prev, location: locationData }));
  }, [latitude, longitude]);

  useEffect(() => {
    const storedUsernames = Object.keys(localStorage).filter((key) => key.endsWith('*'));

    if (storedUsernames.length > 0) {
      const firstStoredUsername = storedUsernames[0];
      const storedUsername = firstStoredUsername.slice(0, -1); // Remove the '1' suffix from the stored username

      if (storedUsername === 'admin@gmail.com') {
        navigate(`/admin/${storedUsername}`); // Redirect to the admin page
      } else {
        navigate(`/addtask/${storedUsername}`); // Redirect to the appropriate page
      }
    }
  }, [navigate]);


  return (
    <div>
      <LoginNav />
      <MDBContainer className="p-5 my-5 d-flex flex-column">
        <div className="card" style={{ width: '90%', maxWidth: '500px', margin: '0 auto', minHeight: '300px' }}>
          <div className="card-body">
            <h6 style={{ textAlign: 'center' }}>Login</h6>
            <MDBInput
              style={{ background: 'white', color: 'blue', marginTop: '13px' }}
              label="Mobile Number"
              id="form1"
              type="text"
              name="number"
              onChange={handleChange}
            />
            <MDBInput
              style={{ background: 'white', color: 'blue', marginTop: '20px' }}
              label="Password"
              id="form2"
              type="password"
              name="password"
              onChange={handleChange}
            />

            <div style={{ marginTop: '4px' }} className="d-flex justify-content-between mx-1 mb-4">
              <MDBCheckbox name="flexCheck" value="" id="flexCheckDefault" label="Remember me" />
            </div>

            <MDBBtn color="primary" className="logbtn" style={{ width: '70%' }} onClick={formSubmitter}>
              Sign in
            </MDBBtn>
          </div>
        </div>
      </MDBContainer>
    </div>
  );
}

export default Login;

const LoginNav = () => {
  return (
    <>
      <MDBNavbar expand="lg" dark bgColor="primary">
        <MDBContainer fluid>
          <MDBNavbarBrand style={{ textAlign: 'center' }} href="#">
            Sakthi 
          </MDBNavbarBrand>
          <MDBNavbarToggler
            type="button"
            data-target="#navbarColor02"
            aria-controls="navbarColor02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>

          <MDBNavbarNav className="me-auto mb-2 mb-lg-0"></MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}
