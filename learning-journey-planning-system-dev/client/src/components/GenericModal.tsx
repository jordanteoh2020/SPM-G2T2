import { Button, Modal, Tag, Badge } from "antd";
import { Role } from "../types/Role";
import styles from "../styles/GenericModal.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skill } from "../types/Skill";
import { Course } from "../types/Course";

type Generic = {
  title: string;
  status: string;
  descType: string;
  desc: string;
};

export default function GenericModal(props: {
  role?: Role;
  course?: Course;
  skill?: Skill;
  missing?: boolean;
  status: boolean;
  handleClose: () => void;
}) {
  const [generic, setGeneric] = useState<Generic>({
    title: "",
    status: "",
    descType: "",
    desc: "",
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (props.role) {
      setGeneric({
        title: props.role.position_name,
        status: props.role.position_status,
        descType: "Role",
        desc: props.role.position_desc,
      });

      axios
        .get(
          "http://localhost:5000/positions/" +
            props.role.position_id +
            "/skills/active"
        )
        .then((resp) => setSkills(resp.data.data))
        .catch((err) => console.log(err));
    } else if (props.course) {
      setGeneric({
        title: props.course.course_id + ": " + props.course.course_name,
        status: props.course.course_status,
        descType: "Course",
        desc: props.course.course_desc,
      });

      axios
        .get(
          "http://localhost:5000/courses/" +
            props.course.course_id +
            "/skills/active"
        )
        .then((resp) => setSkills(resp.data.data))
        .catch((err) => console.log(err));
    } else if (props.skill) {
      setGeneric({
        title: props.skill.skill_name,
        status: props.skill.skill_status,
        descType: "Skill",
        desc: props.skill.skill_desc,
      });

      axios
        .get(
          "http://localhost:5000/skills/" +
            props.skill.skill_id +
            "/positions/active"
        )
        .then((resp) => setRoles(resp.data.data))
        .catch((err) => console.log(err));

      axios
        .get(
          "http://localhost:5000/skills/" +
            props.skill.skill_id +
            "/courses/active"
        )
        .then((resp) => setCourses(resp.data.data))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <Modal
        open={props.status}
        onCancel={props.handleClose}
        footer={
          <Button type="primary" onClick={props.handleClose}>
            Close
          </Button>
        }
      >
        <p className={styles.title}>
          {generic.title}
          {props.missing && (
            <Tag className={`${styles.status} ${styles.Retired}`}>Missing</Tag>
          )}
          {(generic.status !== "Active" || props.course) && (
            <Tag className={`${styles.status} ${styles[generic.status]}`}>
              {generic.status}
            </Tag>
          )}
        </p>
        <hr className={styles.hr}></hr>

        <h3>{generic.descType} Description: </h3>
        <p>{generic.desc}</p>

        {props.role && (
          <>
            <h3>Responsibilities:</h3>
            <ul>
              {props.role.position_res.split(";").map((res, i) => (
                <li key={i}>{res}</li>
              ))}
            </ul>

            <h3>Department:</h3>
            <p>{props.role.position_dept}</p>

            <h3>Skills required for the role:</h3>
          </>
        )}

        {props.course && (
          <>
            <h3>Type:</h3>
            <p>
              The course will be conducted{" "}
              {props.course.course_type === "Internal"
                ? "in-house"
                : "off-site"}
              .
            </p>

            <h3>Category:</h3>
            <p>{props.course.course_category}</p>

            <h3>Skills that the course can fulfill:</h3>
          </>
        )}

        {!props.skill &&
          skills.map((skill) => (
            <Badge
              key={skill.skill_id}
              count={skill.skill_name}
              className={styles.badge}
            ></Badge>
          ))}

        {props.skill && (
          <>
            <h3>Roles that require this skill:</h3>
            <ul>
              {roles.map((role) => (
                <li key={role.position_id}>{role.position_name}</li>
              ))}
            </ul>

            <h3>Courses that fulfill this skill:</h3>
            <ul>
              {courses.map((course) => (
                <li key={course.course_id}>{course.course_name}</li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </>
  );
}
