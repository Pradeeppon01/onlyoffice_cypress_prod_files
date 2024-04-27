import { AppstoreAddOutlined, BookOutlined, DiffOutlined, TeamOutlined ,GroupOutlined } from "@ant-design/icons"
import { Menu } from "antd"
import { NavLink, useNavigate ,useLocation} from "react-router-dom"

function AdminSidenav() {
  
  const location=useLocation()
  const navigate = useNavigate()
  var empusername = location.pathname.split('/')[2];
  return (
    <div className="SideMenu" style={{ background: "" }}>
      <Menu
        mode="inline"
        style={{ background: "white", color: "black", borderRight: "2px solid black", minWidth: "15%",height:"100vh" }}
        onClick={(items) => {
          navigate(items.key)
        }}
        items={[
          {
            label: "All Jobs",
            key:`/admin/${empusername}`,
            icon: <BookOutlined />
          },
          {
            label: "Add New Employee",
            key: `/adduser/${empusername}`,
            icon: <TeamOutlined />
          },
          {
            label: "Add Jobs and Machines",
            key: `/addmachines/${empusername}`,
            icon: <GroupOutlined />
          },
        ]}
      >
      </Menu>
    </div>
  )
}

export default AdminSidenav
