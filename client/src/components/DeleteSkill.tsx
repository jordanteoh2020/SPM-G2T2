import { Button, Modal } from "antd";
import React, { useState } from 'react';
import axios, { AxiosResponse, AxiosError } from "axios";
import styles from "../styles/Home.module.css"

export default function DeleteSkillBtn(props: any){

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        var url = "http://127.0.0.1:5000/skills/";
        url += props.skill["skill_id"];
        url += "/delete_skill";
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
            content: "Skill has been succesfully deleted!",
            onOk: () => { window.location.reload() }
        });
    };

    const errorModal = () => {
        Modal.error({
            content: "An error occurred deleting the skill! Please try again later.",
        });
    };

    return (
    <>
        <Button type="primary" className={styles.deleteButton} onClick={showModal}>
            Delete
        </Button>
        <Modal title="Are you sure you want to delete this skill?" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p style={{ fontWeight: '600'}}>Skill Name: <span style={{ fontWeight: 'normal'}}>{props.skill["skill_name"]}</span></p>
            <p style={{ fontWeight: '600'}}>Skill Description: <span style={{ fontWeight: 'normal'}}>{props.skill["skill_desc"]}</span></p>
            <p style={{ fontWeight: '600'}}>Skill Status: <span style={{ fontWeight: 'normal'}}>{props.skill["skill_status"]}</span></p>
        </Modal>
    </>
    );
};
