import { Typography, Form, Button, Row, Col, Modal } from "antd";
import axios, { AxiosResponse, AxiosError } from "axios";
import styles from "../styles/ManageLJPS.module.css";

export default function PreviewSkills(props: any) {
  console.log(props);

  const { Title } = Typography;
  const { Paragraph } = Typography;

  var active = "Retired";
  if (props.form.Active) {
    active = "Active";
  }

  var courses = [];
  for (var course of props.form.Courses) {
    courses.push(course.split("_")[0]);
  }

  var skill = {}
  if (props.values === null) {
  skill = {
    skill_name: props.form.Title,
    skill_desc: props.form.Description,
    skill_status: active,
    courses: courses,
  };
  } else {
  skill = {
    skill_id: props.values.skill_id,
    skill_name: props.form.Title,
    skill_desc: props.form.Description,
    skill_status: active,
    courses: courses,
  };
  }
  console.log(skill);

  const submitSkill = async () => {
    if (props.values === null) {
    axios
      .post("http://127.0.0.1:5000/skills/create", skill)
      .then((response: AxiosResponse) => {
        console.log(response.status);
        success();
      })
      .catch((reason: AxiosError) => {
        console.log(reason.response!.status);
        if (reason.response!.status === 406) {
          warning2();
          console.log("Duplicated course");
        }
        if (reason.response!.status === 400) {
          warning();
          console.log("Skill already exist");
        }

        if (
          reason.response!.status !== 400 &&
          reason.response!.status !== 406
        ) {
          error();
          console.log("Network error");
        }
      });
  } else{
    axios
    .put("http://127.0.0.1:5000/skills/edit_skill", skill)
    .then((response: AxiosResponse) => {
      console.log(response.status);
      success();
    })
    .catch((reason: AxiosError) => {
      console.log(reason.response!.status);
      if (reason.response!.status === 406) {
        warning2();
        console.log("Duplicated course");
      }
      if (reason.response!.status === 400) {
        warning();
        console.log("Skill already exist");
      }
      if (
        reason.response!.status !== 400 &&
        reason.response!.status !== 406
      )
      {
        error();
        console.log("Network error");
      }
    });
  }}

  const success = () => {
    Modal.success({
      content: props.values === null ? "Skill has been successfully created!" : "Skill has been successfully updated!",
    });
    goToForm();
  };

  const warning = () => {
    Modal.warning({
      content: "Skill name already exists. Please try another name.",
    });
  };

  const warning2 = () => {
    Modal.warning({
      content:
        "There is duplicate course. Please select another course or remove duplicated course.",
    });
  };

  const error = () => {
    Modal.error({
      content: props.values === null ? "An error occurred creating the skill! Please try again later." : "An error occurred updating the skill! Please try again later.",
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
        Review Skill
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
            <Title level={5}>Courses </Title>
          </Col>
          <Col span={19}>
            <Paragraph> {props.form.Courses[0].split("_")[1]} </Paragraph>
          </Col>
        </Row>
        {props.form.Courses.length > 1
          ? props.form.Courses.slice(1).map((eachCourse: any) => (
              <Row style={{ marginBottom: "2%" }}>
                <Col span={5}></Col>
                <Col span={19}>
                  <Paragraph> {eachCourse.split("_")[1]} </Paragraph>
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
            <Button type="primary" onClick={submitSkill}>
              Confirm
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
