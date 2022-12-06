import { Button, Col, message, Modal, Pagination, Row, Steps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import RoleCourseCard from "../components/RoleCourseCard";
import SkillCard from "../components/SkillCard";
import styles from "../styles/ChooseRole.module.css";
import { Role } from "../types/Role";
import { Skill } from "../types/Skill";
import { Course } from "../types/Course";
import createlj from "../assets/createlj.png";
import LearningJourney from "../components/LearningJourney";

export default function Home({ user }: { user: number }) {
  const [step, setStep] = useState<number>(-1);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<[number, string]>([0, ""]);
  const [skills, setSkills] = useState<Skill[][]>([]);
  const [staffSkillIDs, setStaffSkillIDs] = useState<Set<number>>(new Set());
  const [selectedSkills, setSelectedSkills] = useState<{
    [key: string]: string;
  }>({});
  const [selectedSkillID, setSelectedSkillID] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<{
    [key: string]: string;
  }>({});
  const [err, setErr] = useState<string>("");
  const [skillCourse, setSkillCourse] = useState<[number[], string[]]>([
    [],
    [],
  ]);
  const [LJID, setLJID] = useState<number>(0);
  const [finalSkills, setFinalSkills] = useState<Set<number>>(new Set());
  const [droppedSkills, setDroppedSkills] = useState<string[]>([]);
  const [modalStatus, setModalStatus] = useState<boolean>(false);

  useEffect(() => {
    if (roles.length === 0) {
      next();
    }
  }, [selectedRole]);

  function next() {
    axios
      .get("http://localhost:5000/positions/" + selectedRole[0] + "/skills")
      .then((resp) => {
        const rows = [];
        let row = [];
        for (let col of resp.data.data) {
          if (row.length === 3) {
            rows.push(row);
            row = [];
          }
          if (col.skill_status === "Active" || selectedSkills[col.skill_id]) {
            row.push(col);
          }
        }
        if (row.length > 0) {
          rows.push(row);
        }
        setSkills(rows);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5000/staff/" + user + "/skill_ids")
      .then((resp) => setStaffSkillIDs(new Set(resp.data.data)))
      .catch((err) => console.log(err));
  }

  return (
    <>
      {step === -1 ? (
        <LearningJourney
          step={step}
          setStep={setStep}
          setSelectedRole={setSelectedRole}
          setSelectedSkills={setSelectedSkills}
          setSelectedCourses={setSelectedCourses}
          setLJID={setLJID}
          user={user}
          create={() => {
            axios
              .get("http://localhost:5000/positions/all")
              .then((resp) => setRoles(resp.data.data))
              .catch((err) => console.log(err));
          }}
        />
      ) : (
        <>
          <h1>{ roles.length === 0 ? 'Edit' : 'Create' } Your Desired Learning Journey</h1>

          <div className={styles.content}>
            <Steps
              labelPlacement="vertical"
              current={step}
              className={styles.step}
            >
              <Steps.Step title="Choose a role" />
              <Steps.Step title="Choose skills" />
              <Steps.Step title="Choose courses" />
            </Steps>

            <div className={styles.selection}>
              <p className={styles.selectionLabel}>
                Role Selected:{" "}
                <span className={styles.selectionContent}>
                  {selectedRole[1]}
                </span>
              </p>
              <p className={styles.selectionLabel}>
                Skills Selected:{" "}
                <span className={styles.selectionContent}>
                  {Object.values(selectedSkills).join(", ")}
                </span>
              </p>
              <p className={styles.selectionLabel}>
                Courses Selected:{" "}
                <span className={styles.selectionContent}>
                  {Object.values(selectedCourses).join(", ")}
                </span>
              </p>
            </div>

            {step === 0 &&
              roles.map(
                (role) =>
                  (role.position_status === "Active" ||
                    role.position_id === selectedRole[0]) && (
                    <RoleCourseCard
                      role={role}
                      purpose="lj"
                      selectedRole={selectedRole}
                      handleClick={() => {
                        setSelectedRole([role.position_id, role.position_name]);
                        setSelectedSkills({});
                        setSelectedCourses({});
                        setErr("");
                      }}
                      key={role.position_id}
                    />
                  )
              )}

            {step === 1 &&
              skills.map((row, i) => (
                <div className={styles.skillRow} key={i}>
                  {row.map((skill) => (
                    <SkillCard
                      skill={skill}
                      purpose="lj"
                      staffSkillIDs={staffSkillIDs}
                      selectedSkills={selectedSkills}
                      handleClick={() => {
                        const newSelectedSkills = { ...selectedSkills };
                        if (newSelectedSkills[skill.skill_id]) {
                          delete newSelectedSkills[skill.skill_id];
                        } else {
                          newSelectedSkills[skill.skill_id] = skill.skill_name;
                          setErr("");
                        }
                        setSelectedSkills(newSelectedSkills);
                        setSelectedCourses({});
                      }}
                      key={skill.skill_id}
                    />
                  ))}
                </div>
              ))}

            {step === 2 && (
              <Row>
                <Col span={5}>
                  {Object.keys(selectedSkills).map((skillID) => (
                    <Button
                      onClick={() => {
                        setSelectedSkillID(skillID);
                        axios
                          .get(
                            "http://localhost:5000/skills/" +
                              skillID +
                              "/courses"
                          )
                          .then((resp) => setCourses(resp.data.data))
                          .catch((err) => console.log(err));
                      }}
                      type={selectedSkillID === skillID ? "primary" : "default"}
                      className={styles.selectedSkill}
                      key={skillID}
                    >
                      {selectedSkills[skillID]}
                    </Button>
                  ))}
                </Col>
                <Col span={19}>
                  {courses.map(
                    (course) =>
                      (course.course_status === "Active" ||
                        selectedCourses[course.course_id]) && (
                        <RoleCourseCard
                          course={course}
                          purpose="lj"
                          selectedCourses={selectedCourses}
                          handleClick={() => {
                            const newSelectedCourses = { ...selectedCourses };
                            if (newSelectedCourses[course.course_id]) {
                              delete newSelectedCourses[course.course_id];
                            } else {
                              newSelectedCourses[course.course_id] =
                                course.course_name;
                              setErr("");
                            }
                            setSelectedCourses(newSelectedCourses);
                          }}
                          key={course.course_id}
                        />
                      )
                  )}
                </Col>
              </Row>
            )}
          </div>

          <p className={styles.err}>{err}</p>
          <div className={styles.bottom}>
            <Pagination total={15} defaultPageSize={3} />
            <div>
              <Button
                onClick={() => {
                  if (roles.length === 0) {
                    if (step === 1) {
                      setSelectedRole([0, ""]);
                      setSelectedSkills({});
                      setSelectedCourses({});
                      setStep(step - 2);
                    } else {
                      setStep(step - 1);
                    }
                  } else {
                    if (step === 0) {
                      setSelectedRole([0, ""]);
                      setSelectedSkills({});
                      setSelectedCourses({});
                      setRoles([]);
                    }
                    setStep(step - 1);
                  }
                }}
                className={styles.back}
              >
                Back
              </Button>
              {step < 2 ? (
                <Button
                  type="primary"
                  onClick={() => {
                    if (step === 0) {
                      if (selectedRole[1] === "") {
                        setErr("Please select a role.");
                      } else {
                        next();
                        setStep(step + 1);
                      }
                    } else if (step === 1) {
                      if (Object.keys(selectedSkills).length === 0) {
                        setErr("Please select at least 1 skill.");
                      } else {
                        const skillID = Object.keys(selectedSkills)[0];
                        setSelectedSkillID(skillID);
                        axios
                          .get(
                            "http://localhost:5000/skills/" +
                              skillID +
                              "/courses"
                          )
                          .then((resp) => setCourses(resp.data.data))
                          .catch((err) => console.log(err));
                        setStep(step + 1);
                      }
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    if (Object.keys(selectedCourses).length === 0) {
                      setErr("Please select at least 1 course.");
                    } else {
                      axios
                        .post("http://localhost:5000/skills/skill_course", {
                          skill_ids: Object.keys(selectedSkills),
                          course_ids: Object.keys(selectedCourses),
                        })
                        .then((resp) => {
                          setSkillCourse(resp.data.data);
                          setFinalSkills(new Set(skillCourse[0]));
                          setDroppedSkills(
                            Object.keys(selectedSkills)
                              .filter((skillID) => !finalSkills.has(+skillID))
                              .map((skillID) => selectedSkills[skillID])
                          );
                          setModalStatus(true);
                        })
                        .catch((err) => console.log(err));
                    }
                  }}
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
          <Modal
            open={modalStatus}
            onCancel={() => setModalStatus(false)}
            footer={null}
            width="25vw"
          >
            <img
              src={createlj}
              alt="createlj icon"
              className={styles.modalImg}
            />
            <p className={styles.modalTitle}>Confirm Learning Journey?</p>
            <div className={styles.modalContent}>
              You are {roles.length === 0 ? "updating" : "creating"} a learning journey for the following:
              <br />
              <br />
              Role:{" "}
              <span className={styles.selectionContent}>{selectedRole[1]}</span>
              <br />
              Skills:{" "}
              <span className={styles.selectionContent}>
                {Array.from(new Set(skillCourse[0]))
                  .map((skillID) => selectedSkills[skillID])
                  .join(", ")}
              </span>
              <br />
              Courses:{" "}
              <span className={styles.selectionContent}>
                {Object.values(selectedCourses).join(", ")}
              </span>
              {Object.keys(selectedSkills).length !==
                new Set(skillCourse[0]).size && (
                <p className={styles.modalErr}>
                  These skills are dropped as no related courses have been
                  selected:{" "}
                  {Object.keys(selectedSkills)
                    .filter((skillID) => !new Set(skillCourse[0]).has(+skillID))
                    .map((skillID) => selectedSkills[skillID])}
                </p>
              )}
            </div>
            <Button
              className={styles.modalBtn}
              onClick={() => {
                if (roles.length === 0) {
                  axios
                  .post(
                    "http://localhost:5000/learning_journeys/" + LJID + "/delete",
                  )
                  .then((resp) => {
                    console.log(resp)
                    // setStep(-1);
                  })
                  .catch((err) => console.log(err));

                } 
                axios
                .post(
                  "http://localhost:5000/learning_journeys/create",
                  {
                    lj_id: roles.length === 0 ? LJID : 0,
                    staff_id: user,
                    position_id: selectedRole[0],
                    skill_course: skillCourse,
                  }
                )
                .then((resp) => {
                  console.log(resp)
                  if (roles.length === 0) {
                    message.success("Your learning journey has been successfully updated!");
                  } else {
                    message.success("Your learning journey has been successfully created!");
                  }
                  // setStep(-1);
                })
                .catch((err) => console.log(err));
                setTimeout(function(){
                  window.location.reload();
               }, 1000);
              }}
            >
              Confirm
            </Button>
          </Modal>
        </>
      )}
    </>
  );
}
