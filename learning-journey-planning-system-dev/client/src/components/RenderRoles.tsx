import { Row, Col, Input, Button } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/RenderHRCard.module.css";
import RoleCourseCard from "../components/RoleCourseCard";
import { Role } from "../types/Role";

export default function RenderRoles(props: any) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchedRoles, setSearchedRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState<boolean>(false);

  const callback = (editRole: Role | undefined) => {
    props.setValues(editRole);
    props.setRolesStep("form");
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/positions/all")
      .then((resp) => setRoles(resp.data.data))
      .catch((err) => console.log(err));
  }, []);

  console.log(roles);

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
      <div className={styles.container}>
        <Row style={{ width: "50vw", margin: "0 auto 8vh auto" }}>
          <Col span={8}>
            <Input
              placeholder="Enter search"
              className={styles.search}
              onChange={handleChange}
            />
          </Col>
          <Col span={4} offset={12}>
            <Button
              type="primary"
              onClick={() => props.setRolesStep("form") & props.setValues(null)}
              id="createRoleBtn"
            >
              Create role
            </Button>
          </Col>
        </Row>
        {search
          ? searchedRoles &&
            searchedRoles.map((searchedRole) => (
              <RoleCourseCard
                role={searchedRole}
                purpose="edit"
                editClicked={callback}
              />
            ))
          : roles &&
            roles.map((role) => (
              <RoleCourseCard
                role={role}
                purpose="edit"
                editClicked={callback}
              />
            ))}
      </div>
    </>
  );
}
