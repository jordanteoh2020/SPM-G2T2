import { Row, Input, Col } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import RoleCourseCard from "../components/RoleCourseCard";
import { Role } from "../types/Role";
import styles from "../styles/RenderHRCard.module.css";

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchedRoles, setSearchedRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState<boolean>(false);

  const callback = () => {};

  useEffect(() => {
    axios
      .get("http://localhost:5000/positions/active")
      .then((resp) => setRoles(resp.data.data))
      .catch((err) => console.log(err));
  }, []);

  function handleChange(event: any) {
    console.log(event.target.value);
    console.log(event.target.value.length);
    var tempSearchedRoles = [];
    for (let role of roles) {
      if (
        role.position_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        tempSearchedRoles.push(role);
      }
    }
    setSearchedRoles(tempSearchedRoles);
    console.log(searchedRoles);
    setSearch(true);
    if (event.target.value.length === 0) {
      setSearch(false);
    }
  }

  return (
    <>
      <Row>
        <Col>
          <h1>Available Roles</h1>
        </Col>
        <Col style={{ paddingTop: "0.2vh" }} offset={1}>
          <Input
            placeholder="Enter search"
            className={styles.search}
            onChange={handleChange}
          />
        </Col>
      </Row>
      <div style={{ width: "50vw", margin: "auto", marginTop: "10vh" }}>
        <Row style={{ marginBottom: "5vh" }}>
          <b>{search ? searchedRoles.length : roles.length} Roles Displayed</b>
        </Row>
        {search
          ? searchedRoles &&
            searchedRoles.map((searchedRole) => (
              <RoleCourseCard
                role={searchedRole}
                purpose="view"
                editClicked={callback}
              />
            ))
          : roles &&
            roles.map((role) => (
              <RoleCourseCard
                role={role}
                purpose="view"
                editClicked={callback}
              />
            ))}
      </div>
    </>
  );
}
