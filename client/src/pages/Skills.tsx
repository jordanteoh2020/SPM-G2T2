import { Row, Input, Col } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import SkillCard from "../components/SkillCard";
import { Skill } from "../types/Skill";
import styles from "../styles/RenderHRCard.module.css";

export default function Skills() {
  const callback = () => {};
  const [skills, setSkills] = useState<Skill[][]>([]);
  const [countSkills, setCountSkills] = useState();
  const [searchedSkills, setSearchedSkills] = useState<Skill[][]>([]);
  const [countSearchedSkills, setCountSearchedSkills] = useState<number>();
  const [search, setSearch] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/skills/active")
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
        setCountSkills(resp.data.data.length);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleChange(event: any) {
    console.log(event.target.value);
    console.log(event.target.value.length);
    var tempSearchedSkills: Skill[][] = [];
    var tempRow: Skill[] = [];
    var count: number = 0;
    for (let row of skills) {
      for (let skill of row) {
        if (
          skill.skill_name
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        ) {
          if (tempRow.length === 3) {
            tempSearchedSkills.push(tempRow);
            count += 3;
            tempRow = [];
          }
          tempRow.push(skill);
        }
      }
    }
    if (tempRow.length > 0) {
      tempSearchedSkills.push(tempRow);
      count += tempRow.length;
    }
    setSearchedSkills(tempSearchedSkills);
    console.log(searchedSkills);
    setSearch(true);
    setCountSearchedSkills(count);
    if (event.target.value.length === 0) {
      setSearch(false);
    }
  }

  return (
    <>
      <Row>
        <Col>
          <h1>Available Skills</h1>
        </Col>
        <Col style={{ paddingTop: "0.2vh" }} offset={1}>
          <Input
            placeholder="Enter search"
            className={styles.search}
            onChange={handleChange}
          />
        </Col>
      </Row>
      <div style={{ width: "66vw", margin: "auto", marginTop: "10vh" }}>
        <Row style={{ marginBottom: "5vh" }}>
          <b>{search ? countSearchedSkills : countSkills} Skills Displayed</b>
        </Row>
        {search
          ? searchedSkills &&
            searchedSkills.map((row) => (
              <Row className={styles.skill}>
                {row.map((skill: Skill) => (
                  <Col key={skill.skill_id}>
                    <SkillCard
                      skill={skill}
                      purpose="view"
                      // editClicked={callback}
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
                      purpose="view"
                      // editClicked={callback}
                    />
                  </Col>
                ))}
              </Row>
            ))}
      </div>
    </>
  );
}
