import { Typography, Form, Button, Switch, Row, Col } from "antd";
import { useEffect } from "react";
import InputField from "./InputField";
import InputDropdown from "./InputDropdown";
import styles from "../styles/ManageLJPS.module.css";

export default function CreateSkills(props: any) {
  const { Title } = Typography;
  const [form] = Form.useForm();

  console.log(props.setValues);

  useEffect(() => {
    console.log(props.setValues);
    if (props.setValues !== null) {

      const loadAsync = async () => {

        try {
          const response = await fetch("http://localhost:5000/skills/" + props.setValues.skill_id + "/courses");
          const courses = await response.json();
          console.log(courses.data);

          var reformatCourses: string[] = [];

          for (let course of courses.data) {
            reformatCourses.push(course.course_id + "_" + course.course_name);
          }

          form.setFieldsValue({
            Title: props.setValues.skill_name,
            Description: props.setValues.skill_desc,
            Courses: reformatCourses,
            Active: props.setValues.skill_status === "Active" ? true : false
          });

        } catch (error) {
          console.log(error);
        }
       
      }

      loadAsync();
    }
   }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Errors:", errorInfo);
  };

  const onFinish = (values: any) => {
    console.log("Form:", values);
    console.log("Title:", values["Title"]);
    console.log("Description:", values["Description"]);
    console.log("Courses:", values["Courses"]);
    console.log("Active:", values["Active"]);
    props.setForm(values);
    props.setNext("preview");
  };

  return (
    <>
      <Title
        className={`${styles.tabTitleColor} ${styles.tabTitleSpacing}`}
        level={4}
      >
        {props.setValues === null ? 'Create a new skill' : 'Edit skill'}
      </Title>
      <Form
        name="userForm"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
        layout="horizontal"
        initialValues={{ remember: true }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ marginLeft: 10 }}
      >
        <InputField label="Title" name="Title"></InputField>
        <InputField label="Description" name="Description"></InputField>
        <InputDropdown label="Courses" name="Courses"></InputDropdown>
        <Form.Item label="Active" name="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Row style={{ justifyContent: "flex-end" }}>
          <Col style={{ marginRight: "1vw" }}>
            <Form.Item>
              <Button onClick={() => props.setSkillsStep("view")}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit" id="createSkillBtn">
              {props.setValues === null ? 'Create skill' : 'Edit skill'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
