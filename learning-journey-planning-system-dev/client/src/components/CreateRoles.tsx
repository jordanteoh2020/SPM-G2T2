import { Typography, Form, Button, Switch, Row, Col } from "antd";
import { useEffect } from "react";
import InputField from "./InputField";
import MultipleInputFields from "./MultipleInputFields";
import InputDropdown from "./InputDropdown";
import styles from "../styles/ManageLJPS.module.css";

export default function CreateRoles(props: any) {

  console.log(props.setValues);

  const { Title } = Typography;
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(props.setValues);
    if (props.setValues !== null) {

      const loadAsync = async () => {

        try {
          const response = await fetch("http://localhost:5000/positions/" + props.setValues.position_id + "/skills");
          const skills = await response.json();
          console.log(skills.data);

          var reformatSkills: string[] = [];

          for (let skill of skills.data) {
            reformatSkills.push(skill.skill_id + "_" + skill.skill_name);
          }

          form.setFieldsValue({
            Title: props.setValues.position_name,
            Description: props.setValues.position_desc,
            Department: props.setValues.position_dept, 
            Responsibilities: props.setValues.position_res.split(";"),
            Skills: reformatSkills,
            Active: props.setValues.position_status === "Active" ? true : false
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
    console.log("Department:", values["Department"]);
    console.log("Responsibilities:", values["Responsibilities"]);
    console.log("Skills:", values["Skills"]);
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
        {props.setValues === null ? 'Create a new role' : 'Edit role'}
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
        <InputDropdown label="Department" name="Department"></InputDropdown>
        <MultipleInputFields
          label="Responsibilities"
          name="Responsibilities"
        ></MultipleInputFields>
        <InputDropdown label="Skills" name="Skills"></InputDropdown>
        <Form.Item label="Active" name="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Row style={{ justifyContent: "flex-end" }}>
          <Col style={{ marginRight: "1vw" }}>
            <Form.Item>
              <Button onClick={() => props.setRolesStep("view")}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit" id="createRoleBtn">
              {props.setValues === null ? 'Create role' : 'Edit role'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
