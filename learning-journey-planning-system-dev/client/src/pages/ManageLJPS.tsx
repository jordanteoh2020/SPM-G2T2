import { useState } from "react";
import { Tabs } from "antd";
import RenderRoles from "../components/RenderRoles";
import RenderSkills from "../components/RenderSkills";
import RenderCourses from "../components/RenderCourses";
import CreateRoles from "../components/CreateRoles";
import PreviewRoles from "../components/PreviewRoles";
import CreateSkills from "../components/CreateSkills";
import PreviewSkills from "../components/PreviewSkills";

export default function ManageLJPS() {
  const [rolesStep, setRolesStep] = useState("view");
  const [skillsStep, setSkillsStep] = useState("view");
  const [form, setForm] = useState(null);
  const [values, setValues] = useState(null);

  return (
    <>
      <h1>Manage LJPS</h1>

      <Tabs
        items={[
          {
            label: "Roles",
            key: "roles",
            children: 
              rolesStep === "view" ? <RenderRoles setRolesStep={setRolesStep} setValues={setValues}/> :
              (rolesStep === "form" ? (
                <CreateRoles setRolesStep={setRolesStep} setForm={setForm} setNext={setRolesStep} setValues={values}/>
              ) : (
                <PreviewRoles form={form} setNext={setRolesStep} values={values}/>
              )),
          },
          {
            label: "Skills",
            key: "skills",
            children:
              skillsStep === "view" ? <RenderSkills setSkillsStep={setSkillsStep} setValues={setValues}/> :
              (skillsStep === "form" ? (
                <CreateSkills setSkillsStep={setSkillsStep} setForm={setForm} setNext={setSkillsStep} setValues={values} />
              ) : (
                <PreviewSkills form={form} setNext={setSkillsStep} values={values}/>
              )),
          },
          {
            label: "Courses",
            key: "course",
            children: <RenderCourses/>,
          },
        ]}
      />
    </>
  );
}
