import { Button, Tag } from "antd";
import { useState } from "react";
import styles from "../styles/SkillCard.module.css";
import { Skill } from "../types/Skill";
import GenericModal from "./GenericModal";

export default function SkillCard(props: {
  skill: Skill;
  purpose: "view" | "lj" | "edit";
  staffSkillIDs?: Set<number>;
  selectedSkills?: { [key: string]: string };
  handleClick?: () => void;
  editClicked?: (editRole: Skill | undefined) => void;
}) {
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const missing =
    props.staffSkillIDs && !props.staffSkillIDs.has(props.skill.skill_id);

  return (
    <div
      className={`${styles.card} ${
        props.selectedSkills &&
        props.selectedSkills[props.skill.skill_id] &&
        styles.cardSelected
      } ${props.purpose === "lj" && styles.hover}`}
      onClick={props.handleClick}
    >
      <p className={styles.title}>
        {props.skill.skill_name}
        {missing && (
          <Tag className={`${styles.status} ${styles.Retired}`}>Missing</Tag>
        )}
        {(props.purpose === "edit" ||
          props.skill.skill_status === "Retired") && (
          <Tag
            className={`${styles.status} ${styles[props.skill.skill_status]}`}
          >
            {props.skill.skill_status}
          </Tag>
        )}
      </p>
      {props.skill.skill_desc.length > 100
        ? props.skill.skill_desc.substring(0, 100) + " ..."
        : props.skill.skill_desc}
      {props.purpose === "edit" ? (
        <Button
          className={styles.btn}
          onClick={() => props.editClicked && props.editClicked(props.skill)}
        >
          Edit
        </Button>
      ) : (
        <Button className={styles.btn} onClick={() => setModalStatus(true)}>
          Read More
        </Button>
      )}
      <GenericModal
        skill={props.skill}
        missing={missing}
        status={modalStatus}
        handleClose={() => setModalStatus(false)}
      />
    </div>
  );
}
