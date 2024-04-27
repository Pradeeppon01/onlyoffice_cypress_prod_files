import React, { useState, useEffect } from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBCollapse
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function EmployeeNavbar({ empname }) {
  const [showNavColor, setShowNavColor] = useState(false);
  const [showNavColorSecond, setShowNavColorSecond] = useState(false);
  const [showNavColorThird, setShowNavColorThird] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  var empusername = decodeURIComponent(location.pathname.split('/')[2]);

  const logouthandler = () => {
    localStorage.removeItem(empusername + '*');
    localStorage.removeItem(empusername + '*' + 'location:');

    navigate('/');
  };

  useEffect(() => {
    const auth = localStorage.getItem(empusername + '*');
    console.log(auth);
    if (auth == 'true') {
    } else {
      setTimeout(() => {
        navigate('/')
      }, 2000);
    }
  }, []);

  return (
    <>
      <MDBNavbar expand='lg' dark bgColor='primary'>
        <MDBContainer fluid>
          <MDBNavbarBrand href='#'>Sakthi</MDBNavbarBrand>
          <MDBNavbarToggler
            type='button'
            data-target='#navbarColor02'
            aria-controls='navbarColor02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowNavColor(!showNavColor)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <MDBCollapse show={showNavColor} navbar>
            <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
              <MDBNavbarItem style={{marginTop:"8px"}}>
              
                  <Link style={{ color: 'white' }} to={`/addtask/${empname}`}>
                    LogTaskStatus
                  </Link>
               
              </MDBNavbarItem>

              <MDBNavbarItem style={{marginTop:"8px",marginLeft:"6px"}}>
               
                  <Link style={{ color: 'white' }} to={`/viewtask/${empname}`}>
                    ViewTsk
                  </Link>
             
              </MDBNavbarItem>

              <MDBNavbarItem>
                <MDBNavbarLink className='btn btn-primary' onClick={logouthandler}>
                  Logout
                </MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <MDBNavbarLink href='#'>{empusername}</MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}
