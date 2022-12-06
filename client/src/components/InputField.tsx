import { Form, Input } from "antd";

interface InputFieldsProps {
  label?: string;
  name?: string;
}

/**
 * This is the input field component!
 * @param {InputFieldsProps} props for React Functional Component
 * @return {React.FC}: The JSX Code for input field template component.
 */
export default function InputField(props: InputFieldsProps) {
  const { TextArea } = Input;

  return (
    <>
      {props.label === "Title" ? (
        <Form.Item
          label={props.label}
          name={props.label}
          tooltip="This is a required field"
          rules={[
            {
              required: true,
              message: "Please enter a title",
            },
          ]}
        >
          <Input style={{ width: "30vw" }}/>
        </Form.Item>
      ) : (
        <Form.Item
          label={props.label}
          name={props.label}
          tooltip="This is a required field"
          rules={[
            {
              required: true,
              message: "Please enter a description",
            },
          ]}
        >
          <TextArea style={{ width: "30vw", maxWidth: "125%" }}/>
        </Form.Item>
      )}
    </>
  );
}
