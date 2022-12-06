import { Button, Modal } from "antd";
import React, { useState } from 'react';
import axios, { AxiosResponse, AxiosError } from "axios";
import styles from "../styles/Home.module.css"

export default function DeleteLJBtn(props: any){

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        var url = "http://127.0.0.1:5000/learning_journeys/";
        url += props.lj[0];
        url += "/delete";
        console.log(url);

        axios.post(url, {
        })
        
        .then(Axiosresponse => {
            console.log(Axiosresponse.status);
            if (Axiosresponse.status === 201) {
                successModal();
            }
            if (Axiosresponse.status === 500) {
                errorModal();
            }

        })
        
        .catch((reason: AxiosError) => {
            console.log(reason.response!.status);
            if (reason.response!.status === 500) {
                errorModal()
            }
        })

        setIsModalOpen(false);
        
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const successModal = () => {
        Modal.success({
            content: "Learning Journey has been succesfully deleted!",
            onOk: () => { window.location.reload() }
        });
    };

    const errorModal = () => {
        Modal.error({
            content: "An error occurred deleting the Learning Journey! Please try again later.",
        });
    };

    // SKILLS STRING
    var skillsString = "";
    var skills = props.lj[1].skill;
    for (var i = 0; i < skills.length; i++) {
        skillsString += skills[i].skill_name + ", ";
    };
    skillsString = skillsString.slice(0, skillsString.length - 2);
    // SKILLS STRING

    // COURSES STRING
    var courseString = "";
    var courses = props.lj[1].course;
    for (var j = 0; j < courses.length; j++) {
        courseString += courses[j].course_name + ", ";
    };
    courseString = courseString.slice(0, courseString.length - 2)
    // COURSES STRING

    return (
    <>
        <Button type="primary" className={styles.deleteButton} onClick={showModal}>
            Delete
        </Button>
        <Modal title="Are you sure you want to delete this learning journey?" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p style={{ fontWeight: '600'}}>Learning Journey ID: <span style={{ fontWeight: 'normal'}}>{props.lj[0]}</span></p>
            <p style={{ fontWeight: '600'}}>Role: <span style={{ fontWeight: 'normal'}}>{props.lj[1].position.position_name}</span></p>
            <p style={{ fontWeight: '600'}}>Skills: <span style={{ fontWeight: 'normal'}}>{skillsString}</span></p>
            <p style={{ fontWeight: '600'}}>Courses: <span style={{ fontWeight: 'normal'}}>{courseString}</span></p>
        </Modal>
    </>
    );
};
