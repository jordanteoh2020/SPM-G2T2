import { Row, Col, Table, Card, Button, Typography, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import gorilla_image from "../assets/gorilla_image.png";
import styles from "../styles/Home.module.css";
import DeleteLJBtn from "./DeleteLearningJourney";
import { useEffect, useState } from "react";

type DataType = {
  key: number;
  learningJourney: number;
  role: String;
  roleStatus: String;
  requiredSkills: number;
  missingSkills: number;
  addedCourses: number;
  editAction: String;
  deleteAction: number;
};

type SelectedSkill = {
  skill_id: number;
  skill_name: string;
  skill_status: string;
};

type SelectedCourse = {
  course_id: string;
  course_name: string;
  course_status: string;
};

export default function LearningJourney(props: {
  step: number;
  setStep: (val: number) => void;
  setSelectedRole: (val: [number, string]) => void;
  setSelectedSkills: (val: { [key: string]: string }) => void;
  setSelectedCourses: (val: { [key: string]: string }) => void;
  setLJID: (val: number) => void;
  user: number
  create: () => void;
}) {
  const [ljData, setLjData] = useState();
  const [tableData, setTableData] = useState<DataType[]>([]);

  const { Text } = Typography;

  const columns: ColumnsType<DataType> = [
    {
      title: "Learning Journey",
      dataIndex: "learningJourney",
      key: "learningJourney",
      width: "10%",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "20%",
    },
    {
      title: "Role Status",
      dataIndex: "roleStatus",
      key: "roleStatus",
      render: (status) =>
        status === "Active" ? (
          <Tag color="green">{status}</Tag>
        ) : (
          <Tag color="red">{status}</Tag>
        ),
    },
    {
      title: "Number of skills required",
      dataIndex: "requiredSkills",
      key: "requiredSkills",
    },
    {
      title: "Number of missing skills",
      dataIndex: "missingSkills",
      key: "missingSkills",
      render: (text) =>
        text > 0 ? (
          <Text type="danger">{text}</Text>
        ) : (
          <Text type="success">{text}</Text>
        ),
    },
    {
      title: "Number of courses added",
      dataIndex: "addedCourses",
      key: "addedCourses",
    },
    {
      title: "",
      dataIndex: "editAction",
      key: "editAction",
      render: (data) =>
        data[0] === "Active" ? (
          <Button
            onClick={() => {
              console.log(data);
              props.setSelectedRole([
                data[1]["position"].position_id,
                data[1]["position"].position_name,
              ]);
              const selectedSkills: { [key: string]: string } = {};
              for (let skill of data[1]["skill"]) {
                selectedSkills[skill.skill_id] = skill.skill_name;
              }
              props.setSelectedSkills(selectedSkills);
              const selectedCourses: { [key: string]: string } = {};
              for (let course of data[1]["course"]) {
                selectedCourses[course.course_id] = course.course_name;
              }
              props.setSelectedCourses(selectedCourses);
              props.setLJID(data[2]);
              props.setStep(props.step + 2);
            }}
          >
            Edit
          </Button>
        ) : null,
    },
    {
      title: "",
      dataIndex: "deleteAction",
      key: "deleteAction",
      render: (jsonForLJ) => <DeleteLJBtn lj={jsonForLJ}></DeleteLJBtn>,
    },
  ];

  useEffect(() => {
    const loadAsync = async () => {
      try {
        const responseForLJ = await fetch(
          "http://localhost:5000/staff/" + props.user + "/learning_journeys"
        );
        const jsonForLJ = await responseForLJ.json();
        console.log(jsonForLJ);
        setLjData(jsonForLJ.data);

        var tableDataArr: any = [];

        for (let [key, val] of Object.entries(jsonForLJ.data)) {
          console.log(key + " " + val);
          let ljID = key;
          let values: any = val;

          const responseForPS = await fetch(
            "http://localhost:5000/positions/" +
              values.position.position_id +
              "/skills"
          );
          const jsonForPS = await responseForPS.json();
          console.log(jsonForPS.data);
          let uniquePositionSkills = [];
          for (let data of jsonForPS.data) {
            uniquePositionSkills.push(data.skill_id);
          }
          // console.log(uniquePositionSkills);

          const responseForStaffSkills = await fetch(
            "http://localhost:5000/staff/" + props.user + "/skill_ids"
          );
          const jsonForStaffSkills = await responseForStaffSkills.json();
          console.log(jsonForStaffSkills.data);
          let uniqueStaffSkills = [];
          for (let skillId of jsonForStaffSkills.data) {
            uniqueStaffSkills.push(skillId);
          }
          // console.log(uniqueStaffSkills);

          let countMissingSkills = 0;
          for (let skill of uniquePositionSkills) {
            console.log(skill);
            if (!uniqueStaffSkills.includes(skill)) {
              countMissingSkills++;
            }
          }

          let oneTableData = {
            key: Number(ljID),
            learningJourney: Number(ljID),
            role: values.position.position_name,
            roleStatus: values.position.position_status,
            requiredSkills: jsonForPS.data.length,
            missingSkills: countMissingSkills,
            addedCourses: values.course.length,
            editAction: [values.position.position_status, jsonForLJ.data[ljID], ljID],
            deleteAction: [Number(ljID), jsonForLJ.data[ljID]],
          };
          tableDataArr.push(oneTableData);
        }
        // console.log(tableDataArr);
        setTableData(tableDataArr);
        // console.log(tableData);
      } catch (error) {
        console.log(error);
      }
    };
    loadAsync();
  }, []);

  // console.log(ljData);
  // console.log(tableData);

  return (
    <>
      <Row className={styles.row}>
        <Col className={styles.col}>
          <img src={gorilla_image} alt="role icon" />
        </Col>
        <Col className={styles.col}>
          <h1 className={styles.title}>
            Personalise your own learning journey
          </h1>
          <p className={styles.quote}>
            “You cannot reach where you’re going if you continue to be the same
            person you have always been.”
          </p>
        </Col>
      </Row>
      <Card className={styles.card}>
        <div style={{ display: "flex", marginTop: "2vh", marginBottom: "4vh" }}>
          <h1>My Learning Journeys</h1>
          <Button
            type="primary"
            style={{ marginLeft: "5vh" }}
            onClick={() => {
              props.create();
              props.setStep(props.step + 1);
            }}
          >
            Create New
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          className={styles.table}
        />
      </Card>
    </>
  );
}
