import { Row, Col, Input, Button } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/RenderHRCard.module.css";
import SkillCard from "../components/SkillCard";
import { Skill } from "../types/Skill";

export default function RenderSkills(props: any) {
  const [skills, setSkills] = useState<Skill[][]>([]);
  const [searchedSkills, setSearchedSkills] = useState<Skill[][]>([]);
  const [search, setSearch] = useState<boolean>(false);

  const callback = (editSkill: Skill | undefined) => {
    props.setValues(editSkill);
    props.setSkillsStep("form");
  };
  console.log(props.setSkills);
  useEffect(() => {
    axios
      .get("http://localhost:5000/skills/all")
      .then((resp) => {
        const rows = [];
        let row = [];
        for (let col of resp.data.data) {
          if (row.length === 3) {
            rows.push(row);
            row = [];
          }
          row.push(col);
        }
        if (row.length > 0) {
          rows.push(row);
        }
        setSkills(rows);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(skills);

  function handleChange(event: any) {
    console.log(event.target.value);
    console.log(event.target.value.length);
    var tempSearchedSkills: Skill[][] = [];
    var tempRow: Skill[] = [];
    for (let row of skills) {
      for (let skill of row) {
        if (
          skill.skill_name
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        ) {
          if (tempRow.length === 3) {
            tempSearchedSkills.push(tempRow);
            tempRow = [];
          }
          tempRow.push(skill);
        }
      }
    }
    if (tempRow.length > 0) {
      tempSearchedSkills.push(tempRow);
    }
    setSearchedSkills(tempSearchedSkills);
    console.log(searchedSkills);
    setSearch(true);
    if (event.target.value.length === 0) {
      setSearch(false);
    }
  }

  return (
    <>
      {/* <div className={styles.container}> */}
      <Row style={{ width: "100%", margin: "5vh auto 5vh auto" }}>
        <Col span={12}>
          <Input
            placeholder="Enter search"
            className={styles.search}
            onChange={handleChange}
          />
        </Col>
        <Col span={1} offset={11}>
          <Button
            type="primary"
            onClick={() => props.setSkillsStep("form") & props.setValues(null)}
            id="createSkillBtn"
          >
            Create skill
          </Button>
        </Col>
      </Row>
      {/* </div> */}
      <div className={styles.content}>
        {search
          ? searchedSkills &&
            searchedSkills.map((row) => (
              <Row className={styles.skill}>
                {row.map((skill) => (
                  <Col key={skill.skill_id}>
                    <SkillCard
                      skill={skill}
                      purpose="edit"
                      editClicked={callback}
                    />
                  </Col>
                ))}
              </Row>
            ))
          : skills &&
            skills.map((row) => (
              <Row className={styles.skill}>
                {row.map((skill) => (
                  <Col key={skill.skill_id}>
                    <SkillCard
                      skill={skill}
                      purpose="edit"
                      editClicked={callback}
                    />
                  </Col>
                ))}
              </Row>
            ))}
      </div>
    </>
  );
}
