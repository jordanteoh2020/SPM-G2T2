import { useState, useEffect } from "react";
import { MinusCircleOutlined } from "@ant-design/icons";
import { Form, Select, Button } from "antd";
import { Course } from "../types/Course";
import { Skill } from "../types/Skill";

interface InputDropdownProps {
  label?: string;
  name?: string;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

/**
 * This is the input dropdown component!
 * @param {InputFieldsProps} props for React Functional Component
 * @return {React.FC}: The JSX Code for input dropdown template component.
 */
export default function InputDropdown(props: InputDropdownProps) {

  const { Option } = Select;

  const [skills, setSkills] = useState<Skill[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/courses/active")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.data);
      var courseArr = [];
      for (var course of data.data) {
          courseArr.push(course);
      }
      console.log(courseArr);
      setCourses(courseArr);
    })
    .then((error) => console.log(error));
  }, []);

  console.log(courses);

  useEffect(() => {
    fetch("http://localhost:5000/skills/active")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        var skillArr = [];
        for (var skill of data.data) {
            skillArr.push(skill);
        }
        console.log(skillArr);
        setSkills(skillArr);
      })
      .then((error) => console.log(error));
  }, []);

  console.log(skills);

  return (
    <>
      {props.label === "Skills" ? (
        <Form.List name="Skills">
          {(fields, { add, remove }, { errors }) => (
            <>
              <Form.Item {...formItemLayout} label="Skills">
                <Form.Item
                  style={{ display: "inline-block" }}
                  tooltip="This is a required field"
                  // name={0}
                  fieldKey={0}
                  isListField={true}
                  key={0}
                  name={0}
                  validateTrigger={["onChange", "onBlur"]}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please select a skill",
                    },
                  ]}
                  noStyle
                >
                  <Select style={{ width: "30vw" }}>
                    {skills.map((skill: any, i: number) => (
                      <Option
                        value={skill["skill_id"] + "_" + skill["skill_name"]}
                        key={i}
                      >
                        {skill["skill_name"]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <Form.Item style={{ display: "inline-block" }}> */}
                <Button
                  style={{ display: "inline-block", marginLeft: 20 }}
                  onClick={() => add()}
                >
                  Add field
                </Button>
                {/* <Form.ErrorList errors={errors} /> */}
                {/* </Form.Item> */}
              </Form.Item>
              {fields.slice(1).map((field) => (
                <Form.Item {...formItemLayoutWithOutLabel} key={field.key}>
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    //   name={field.key}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please select a skill",
                      },
                    ]}
                    noStyle
                  >
                    <Select style={{ width: "30vw" }}>
                      {skills.map((skill: any, i: number) => (
                        <Option
                          value={skill["skill_id"] + "_" + skill["skill_name"]}
                          key={i}
                        >
                          {skill["skill_name"]}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                    style={{ marginLeft: 20 }}
                  />
                  {/* <Form.Item><Button onClick={() => {console.log(field)}}>test</Button></Form.Item> */}
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>
      ) : null}
      {props.label === "Courses" ? (
        <Form.List name="Courses">
          {(fields, { add, remove }, { errors }) => (
            <>
              <Form.Item {...formItemLayout} label="Courses">
                <Form.Item
                  style={{ display: "inline-block" }}
                  tooltip="This is a required field"
                  // name={0}
                  fieldKey={0}
                  isListField={true}
                  key={0}
                  name={0}
                  validateTrigger={["onChange", "onBlur"]}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please select a course",
                    },
                  ]}
                  noStyle
                >
                  <Select style={{ width: "30vw" }}>
                    {courses.map((course: any, i: number) => (
                      <Option
                        value={
                          course["course_id"] + "_" + course["course_name"]
                        }
                        key={i}
                      >
                        {course["course_name"]}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <Form.Item style={{ display: "inline-block" }}> */}
                <Button
                  style={{ display: "inline-block", marginLeft: 20 }}
                  onClick={() => add()}
                >
                  Add field
                </Button>
                {/* <Form.ErrorList errors={errors} /> */}
                {/* </Form.Item> */}
              </Form.Item>
              {fields.slice(1).map((field) => (
                <Form.Item {...formItemLayoutWithOutLabel} key={field.key}>
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    //   name={field.key}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please select a course",
                      },
                    ]}
                    noStyle
                  >
                    <Select style={{ width: "30vw" }}>
                      {courses.map((course: any, i: number) => (
                        <Option
                          value={
                            course["course_id"] + "_" + course["course_name"]
                          }
                          key={i}
                        >
                          {course["course_name"]}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                    style={{ marginLeft: 20 }}
                  />
                  {/* <Form.Item><Button onClick={() => {console.log(field)}}>test</Button></Form.Item> */}
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>
      ) : null}
      {props.label === "Department" ? (
        <Form.Item
          label={props.label}
          name={props.label}
          tooltip="This is a required field"
          rules={[{ required: true, message: "Please select a department" }]}
        >
          <Select style={{ width: "30vw" }}>
            <Option value="HR">Human Resource</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Sales">Sales</Option>
            <Option value="Operations">Operations</Option>
            <Option value="IT Team">IT Team</Option>
          </Select>
        </Form.Item>
      ) : null}
    </>
  );
}
