import { Row, Input, Col } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import RoleCourseCard from "../components/RoleCourseCard";
import { Course } from "../types/Course";
import styles from "../styles/RenderHRCard.module.css";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchedCourses, setSearchedCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState<boolean>(false);

  const callback = () => {};

  useEffect(() => {
    axios
      .get("http://localhost:5000/courses/active")
      .then((resp) => setCourses(resp.data.data))
      .catch((err) => console.log(err));
  }, []);

  function handleChange(event: any) {
    console.log(event.target.value);
    console.log(event.target.value.length);
    var tempSearchedCourses = [];
    for (let course of courses) {
      if (
        course.course_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        tempSearchedCourses.push(course);
      }
    }
    setSearchedCourses(tempSearchedCourses);
    console.log(searchedCourses);
    setSearch(true);
    if (event.target.value.length === 0) {
      setSearch(false);
    }
  }

  return (
    <>
      <Row>
        <Col>
          <h1>Available Courses</h1>
        </Col>
        <Col style={{ paddingTop: "0.2vh" }} offset={1}>
          <Input
            placeholder="Enter search"
            className={styles.search}
            onChange={handleChange}
          />
        </Col>
      </Row>
      <div style={{ width: "50vw", margin: "auto", marginTop: "10vh" }}>
        <Row style={{ marginBottom: "5vh" }}>
          <b>
            {search ? searchedCourses.length : courses.length} Courses Displayed
          </b>
        </Row>
        {search
          ? searchedCourses &&
            searchedCourses.map((searchedCourse) => (
              <RoleCourseCard
                course={searchedCourse}
                purpose="view"
                editClicked={callback}
              />
            ))
          : courses &&
            courses.map((course) => (
              <RoleCourseCard
                course={course}
                purpose="view"
                editClicked={callback}
              />
            ))}
      </div>
    </>
  );
}
