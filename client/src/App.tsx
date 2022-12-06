import {
  HomeOutlined,
  TeamOutlined,
  TrophyOutlined,
  BookOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import "antd/dist/antd.css";
import "./styles/App.css";
import logo from "./assets/logo.png";
import { useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Roles from "./pages/Roles";
import Skills from "./pages/Skills";
import Courses from "./pages/Courses";
import ManageLJPS from "./pages/ManageLJPS";

const { Content, Sider } = Layout;

export default function App() {
  // use 130001 for Admin and 140001 for Staff, Trainer and Manager
  const [user, setUser] = useState(130001);
  const [role, setRole] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/staff/" + user + "/role")
      .then((resp) => {
        console.log(resp.data.data.role_name);
        setRole(resp.data.data.role_name);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout>
      <BrowserRouter>
        <Sider breakpoint="lg">
          <div className="brand">
            <img
              src={logo}
              className="icon"
              alt="logo"
              style={{ marginRight: "1vw" }}
            />{" "}
            All-in-One LJPS
          </div>
          <Menu mode="inline" defaultSelectedKeys={["Home"]}>
            <Menu.Item icon={<HomeOutlined />} key="Home">
              <Link to="/" className="menu-item-link">
                Home
              </Link>
            </Menu.Item>
            {[
              [<TeamOutlined />, "Roles"],
              [<TrophyOutlined />, "Skills"],
              [<BookOutlined />, "Courses"],
            ].map((navItem) => (
              <Menu.Item icon={navItem[0]} key={navItem[1] as string}>
                <Link
                  to={(navItem[1] as string).toLowerCase()}
                  className="menu-item-link"
                >
                  {navItem[1]}
                </Link>
              </Menu.Item>
            ))}
            {role === "Admin" && (
              <Menu.Item icon={<EditOutlined />} key="LJPS">
                <Link to="/ljps" className="menu-item-link">
                  Manage LJPS
                </Link>
              </Menu.Item>
            )}
          </Menu>
        </Sider>
        <Content>
          <Button
            shape="round"
            icon={<UserOutlined />}
            style={{
              borderColor: "#DBDBDB",
              backgroundColor: "#DBDBDB",
              color: "#000000",
              position: "absolute",
              right: "4vw",
            }}
          >
            Eric
          </Button>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/courses" element={<Courses />} />
            {role === "Admin" && (
              <Route path="/ljps" element={<ManageLJPS />} />
            )}
          </Routes>
        </Content>
      </BrowserRouter>
    </Layout>
  );
}
