import { Typography, Form, Button, Row, Col, Modal } from "antd";
import styles from "../styles/ManageLJPS.module.css";

export default function PreviewRoles(props: any) {
  const { Title } = Typography;
  const { Paragraph } = Typography;

  console.log(props.form);
  console.log(props.values);

  var responsibilities = "";
  for (var resp of props.form.Responsibilities) {
    console.log(resp);
    responsibilities += resp + ";";
  }
  console.log(responsibilities.substring(0, responsibilities.length - 1));

  var active = "Retired";
  if (props.form.Active) {
    active = "Active";
  }

  console.log(active);

  const skillsArr = props.form.Skills;
  console.log(props.form.Skills);
  console.log(props.form.Skills[0].split("_")[0]);

  function containsDuplicates(skillsArr: number[]) {
    if (skillsArr.length !== new Set(skillsArr).size) {
      return true;
    }

    return false;
  }

  var reformatSkills = [];
  for (var skill of props.form.Skills) {
    reformatSkills.push(parseInt(skill.split("_")[0]));
  };

  var position = {}
  if (props.values === null) {
    position = {
      position_name: props.form.Title,
      position_desc: props.form.Description,
      position_dept: props.form.Department,
      position_res: responsibilities.substring(0, responsibilities.length - 1),
      position_skills: reformatSkills,
      position_status: active,
    };
  } else {
    position = {
      position_id: props.values.position_id,
      position_name: props.form.Title,
      position_desc: props.form.Description,
      position_dept: props.form.Department,
      position_res: responsibilities.substring(0, responsibilities.length - 1),
      position_skills: reformatSkills,
      position_status: active,
    };
  }
 
  console.log(position);

  const submitForm = () => {

    if (containsDuplicates(skillsArr)) {
      warningForDuplicateSkill();

    } else {

        if (props.values === null) {
          // insert into Position and PositionSkill table
          fetch("http://localhost:5000/positions/create", {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(position),
          })
            .then((response) => {
              if (response.status === 201) {
                success();
                return response.json();
              } else if (response.status === 400) {
                console.log("Position Name already exists.");
                warningForRoleName();
              } else if (response.status === 500) {
                console.log("An error occurred creating the position.");
                error();
              }
            })
          .then((data) => console.log(data))
          .then((error) => console.log(error));
        } else {
          // Update Position and PositionSkill table
          fetch("http://localhost:5000/positions/edit", {
            headers: {
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(position),
          })
            .then((response) => {
              if (response.status === 200) {
                success();
                return response.json();
              } else if (response.status === 400) {
                console.log("Position Name already exists.");
                warningForRoleName();
              } else if (response.status === 500) {
                console.log("An error occurred updating the position.");
                error();
              }
            })
          .then((data) => console.log(data))
          .then((error) => console.log(error));

        }
    }
  };

  const success = () => {
    Modal.success({
      content: props.values === null ? "Role has been successfully created!" : "Role has been successfully updated!",
    });
    goToForm();
  };

  const warningForRoleName = () => {
    Modal.warning({
      content: "Role name already exists. Please try another name.",
    });
  };

  const warningForDuplicateSkill = () => {
    Modal.warning({
      content:
        "There is duplicate skill. Please select another skill or remove duplicated skill.",
    });
  };

  const error = () => {
    Modal.error({
      content: props.values === null ? "An error occurred creating the role! Please try again later." : "An error occurred updating the role! Please try again later.",
    });
  };

  const goToForm = () => {
    if (props.values === null) {
      props.setNext("form");
    } else {
      props.setNext("view");
    }
  };

  return (
    <>
      <Title
        className={`${styles.tabTitleColor} ${styles.tabTitleSpacing}`}
        level={4}
      >
        Review role
      </Title>
      <div style={{ marginLeft: 10 }}>
        <Row style={{ marginTop: "5%" }}>
          <Col span={5}>
            <Title level={5}>Title </Title>
          </Col>
          <Col span={19}>
            <Paragraph> {props.form.Title}</Paragraph>
          </Col>
        </Row>
        <Row style={{ marginBottom: "2%" }}>
          <Col span={5}>
            <Title level={5}>Description </Title>
          </Col>
          <Col span={19}>
            <Paragraph> {props.form.Description} </Paragraph>
          </Col>
        </Row>
        <Row style={{ marginBottom: "2%" }}>
          <Col span={5}>
            <Title level={5}>Department </Title>
          </Col>
          <Col span={19}>
            <Paragraph> {props.form.Department} </Paragraph>
          </Col>
        </Row>
        <Row style={{ marginBottom: "2%" }}>
          <Col span={5}>
            <Title level={5}>Responsibilities </Title>
          </Col>
          <Col span={19}>
            <Paragraph> {props.form.Responsibilities[0]} </Paragraph>
          </Col>
        </Row>
        {props.form.Responsibilities.length > 1
          ? props.form.Responsibilities.slice(1).map((eachRes: any) => (
              <Row style={{ marginBottom: "2%" }}>
                <Col span={5}></Col>
                <Col span={19}>
                  <Paragraph> {eachRes} </Paragraph>
                </Col>
              </Row>
            ))
          : null}
        <Row style={{ marginBottom: "2%" }}>
          <Col span={5}>
            <Title level={5}>Skills </Title>
          </Col>
          <Col span={19}>
            <Paragraph> {props.form.Skills[0].split("_")[1]} </Paragraph>
          </Col>
        </Row>
        {props.form.Skills.length > 1
          ? props.form.Skills.slice(1).map((eachSkill: any) => (
              <Row style={{ marginBottom: "2%" }}>
                <Col span={5}></Col>
                <Col span={19}>
                  <Paragraph> {eachSkill.split("_")[1]} </Paragraph>
                </Col>
              </Row>
            ))
          : null}
      </div>
      <Row style={{ justifyContent: "flex-end" }}>
        <Col style={{ marginRight: 20 }}>
          <Form.Item>
            <Button onClick={goToForm}>Back</Button>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Button type="primary" onClick={submitForm}>
              Confirm
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
