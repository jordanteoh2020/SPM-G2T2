import { Row, Col, Input } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/RenderHRCard.module.css";
import RoleCourseCard from "../components/RoleCourseCard";
import { Course } from "../types/Course";

export default function RenderCourses(props: any) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchedCourses, setSearchedCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState<boolean>(false);

  const callback = () => {};

  useEffect(() => {
    axios
      .get("http://localhost:5000/courses/all")
      .then((resp) => setCourses(resp.data.data))
      .catch((err) => console.log(err));
  }, []);

  console.log(courses);

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
      <div className={styles.container}>
        <Row style={{ width: "100%", marginBottom: "5vh" }}>
          <Col span={8}>
            <Input
              placeholder="Enter search"
              className={styles.search}
              onChange={handleChange}
            />
          </Col>
        </Row>
        {search
          ? searchedCourses &&
            searchedCourses.map((searchedCourse) => (
              <RoleCourseCard
                course={searchedCourse}
                purpose="edit"
                editClicked={callback}
              />
            ))
          : courses &&
            courses.map((course) => (
              <RoleCourseCard
                course={course}
                purpose="edit"
                editClicked={callback}
              />
            ))}
      </div>
    </>
  );
}
