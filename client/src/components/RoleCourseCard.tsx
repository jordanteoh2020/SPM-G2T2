import { Button, Tag } from "antd";
import { useState } from "react";
import role1 from "../assets/role1.png";
import role2 from "../assets/role2.png";
import course1 from "../assets/course1.png";
import course2 from "../assets/course2.png";
import styles from "../styles/RoleCourseCard.module.css";
import { Role } from "../types/Role";
import { Course } from "../types/Course";
import GenericModal from "./GenericModal";

export default function RoleCourseCard(props: {
  editClicked?: (editRole: Role | undefined) => void;
  purpose: "view" | "lj" | "edit";
  role?: Role;
  course?: Course;
  selectedRole?: [number, string];
  selectedCourses?: {
    [key: string]: string;
  };
  handleClick?: () => void;
}) {
  const [modalStatus, setModalStatus] = useState<boolean>(false);

  function handleClose() {
    setModalStatus(false);
  }
  const [isActive, setActive] = useState(false);

  const toggleClass = () => {
    setActive(!isActive);
  };

  return (
    <div
      className={`${styles.horizontal} ${styles.card} ${
        ((props.selectedRole &&
          props.role &&
          props.selectedRole[0] === props.role.position_id) ||
          (props.selectedCourses &&
            props.course &&
            props.selectedCourses[props.course.course_id])) &&
        styles.cardSelected
      } ${props.purpose === "lj" && styles.hover}`}
      onClick={props.handleClick}
    >
      <div className={styles.horizontal}>
        {props.role ? (
          Math.floor(Math.random() * 2) + 1 === 1 ? (
            <img src={role1} alt="role icon" className={styles.image} />
          ) : (
            <img src={role2} alt="role icon" className={styles.image} />
          )
        ) : props.course?.course_category === "Technical" ? (
          <img src={course1} alt="role icon" className={styles.image} />
        ) : (
          <img src={course2} alt="role icon" className={styles.image} />
        )}
        <div className={styles.cardRow}>
          <p className={styles.title} style={{ lineHeight: "14px" }}>
            {props.role
              ? props.role.position_name
              : props.course && props.course.course_name.length > 30
              ? props.course?.course_id +
                ": " +
                props.course?.course_name.substring(0, 30) +
                " ..."
              : props.course?.course_id + ": " + props.course?.course_name}
            {props.purpose === "edit" &&
            (props.role?.position_status || props.course?.course_status) ===
              "Active" ? (
              <Tag className={styles.activeStatus}>Active</Tag>
            ) : null}
            {props.purpose === "edit" &&
            (props.role?.position_status || props.course?.course_status) ===
              "Pending" ? (
              <Tag className={styles.pendingStatus}>Pending</Tag>
            ) : null}
            {props.purpose === "edit" &&
            (props.role?.position_status || props.course?.course_status) ===
              "Retired" ? (
              <Tag className={styles.retiredStatus}>Retired</Tag>
            ) : null}
          </p>
          <p style={{ color: "#374A59", fontWeight: "bold" }}>
            {" "}
            {props.role ? "Department" : "Category"}:{" "}
            {props.role?.position_dept} {props.course?.course_category}
          </p>
          <p style={{ color: "#374A59", lineHeight: "12px" }}>
            {" "}
            Description:{" "}
            {props.role && props.role?.position_desc.length > 50
              ? props.role?.position_desc.substring(0, 50) + " ..."
              : props.role?.position_desc}
            {props.course && props.course?.course_desc.length > 50
              ? props.course?.course_desc.substring(0, 50) + " ..."
              : props.course?.course_desc}
          </p>
        </div>
      </div>
      {props.purpose === "edit" && props.role ? (
        <Button
          className={styles.edit}
          onClick={() => props.editClicked && props.editClicked(props.role)}
        >
          Edit
        </Button>
      ) : (
        <Button className={styles.more} onClick={() => setModalStatus(true)}>
          Read More
        </Button>
      )}
      <GenericModal
        role={props.role}
        course={props.course}
        status={modalStatus}
        handleClose={handleClose}
      />
    </div>
  );
}
