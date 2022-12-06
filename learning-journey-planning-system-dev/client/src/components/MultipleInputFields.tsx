import { MinusCircleOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";

interface InputFieldsProps {
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
 * This is the multiple input fields component!
 * @param {InputFieldsProps} props for React Functional Component
 * @return {React.FC}: The JSX Code for multiple input fields template component.
 */
export default function MultipleInputFields(props: InputFieldsProps) {
  const { TextArea } = Input;

  return (
    <>
      <Form.List name="Responsibilities">
        {(fields, { add, remove }, { errors }) => (
          <>
            <Form.Item {...formItemLayout} label="Responsibilities">
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
                    message: "Please enter a responsibility",
                  },
                ]}
                noStyle
              >
                <TextArea style={{ width: "30vw" }} />
              </Form.Item>
              {/* <Form.Item style={{ display: "inline-block" }} > */}
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
                      message: "Please enter a responsibility",
                    },
                  ]}
                  noStyle
                >
                  <TextArea style={{ width: "30vw" }} />
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
    </>
  );
}
