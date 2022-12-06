import unittest

import json
from main import app
from backend import db

from backend.model import Skill, Course, SkillCourse, PositionSkill, StaffSkill

class TestSkill(unittest.TestCase): 

    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite://"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['TESTING'] = True


    def create_app(self):
        return app
    

    def setUp(self):
        self.client = app.test_client()
        ctx = app.app_context()
        ctx.push()
        with ctx:
            db.create_all()

            skill_1 = Skill(
                skill_id = 1, 
                skill_name = "Solution Management", 
                skill_desc = "Learn to manage solutions", 
                skill_status = "Active")
            
            skill_2 = Skill(
                skill_id = 2, 
                skill_name = "Project Management", 
                skill_desc = "Learn to manage projects", 
                skill_status = "Retired")

            course_1 = Course(
                course_id = "IS212", 
                course_name = "Software Project Management", 
                course_desc = "Learn how to manage software projects and deliver value", 
                course_status = "Active", 
                course_type = "Internal", 
                course_category = "Technical")

            course_2 = Course(
                course_id = "IS111", 
                course_name = "Intro to Programming", 
                course_desc = "Learn how to problem solve in Python", 
                course_status = "Retired", 
                course_type = "External", 
                course_category = "Technical")

            skill_course_1 = SkillCourse(skill_id = 1, course_id = "IS212")
            skill_course_2 = SkillCourse(skill_id = 1, course_id = "IS111")
            skill_course_3 = SkillCourse(skill_id = 2, course_id = "IS212")
            position_skill_1 = PositionSkill(position_id = 1, skill_id = 1)
            staff_skill_1 = StaffSkill(staff_id = 1, skill_id = 1)

            db.session.add(skill_1)
            db.session.add(skill_2)
            db.session.add(course_1)
            db.session.add(course_2)
            db.session.add(skill_course_1)
            db.session.add(skill_course_2)
            db.session.add(skill_course_3)
            db.session.add(position_skill_1)
            db.session.add(staff_skill_1)


    def tearDown(self):
        db.session.remove()
        db.drop_all()


    def test_get_all_skills(self):
        response = self.client.get("/skills/all")
        self.assertTrue(response.status_code == 200)
        self.assertEquals(len(response.json['data']), 2)
        self.assertListEqual(response.json['data'],[{ 
            "skill_id": 1, 
            "skill_name": "Solution Management",
            "skill_desc": "Learn to manage solutions", 
            "skill_status": "Active"}, {
            "skill_id": 2, 
            "skill_name": "Project Management",
            "skill_desc": "Learn to manage projects", 
            "skill_status": "Retired"}])

    
    def test_get_all_active_skills(self):
        response = self.client.get("/skills/active")
        self.assertTrue(response.status_code == 200)
        self.assertEquals(len(response.json['data']), 1)
        self.assertListEqual(response.json['data'],[{ 
            "skill_id": 1, 
            "skill_name": "Solution Management",
            "skill_desc": "Learn to manage solutions", 
            "skill_status": "Active"}])


    def test_get_courses_by_skill(self, skill_id="1"):
        response = self.client.get("/skills/" + skill_id + "/courses")
        self.assertTrue(response.status_code == 200)
        self.assertEquals(len(response.json['data']), 2)
        self.assertListEqual(response.json['data'],[{
            "course_id": "IS111", 
            "course_name": "Intro to Programming", 
            "course_desc": "Learn how to problem solve in Python", 
            "course_status": "Retired", 
            "course_type": "External", 
            "course_category": "Technical"}, { 
            "course_id": "IS212", 
            "course_name": "Software Project Management", 
            "course_desc": "Learn how to manage software projects and deliver value", 
            "course_status": "Active", 
            "course_type": "Internal", 
            "course_category": "Technical"}])


    def test_get_active_courses_by_skill(self, skill_id="1"):
        response = self.client.get("/skills/" + skill_id + "/courses/active")
        self.assertTrue(response.status_code == 200)
        self.assertEquals(len(response.json['data']), 1)
        self.assertListEqual(response.json['data'],[{ 
            "course_id": "IS212", 
            "course_name": "Software Project Management", 
            "course_desc": "Learn how to manage software projects and deliver value", 
            "course_status": "Active", 
            "course_type": "Internal", 
            "course_category": "Technical"}])


    def test_create_skill(self):

        json_data = {
            "skill_name": "Java Programming", 
            "skill_desc": "Code OOP", 
            "skill_status": "Active",
            "courses": ["IS111"]
        }

        response = self.client.post("/skills/create", data=json.dumps(json_data), content_type="application/json")
        self.assertTrue(response.status_code == 201)
        self.assertEquals(response.json,  {"message": "Skill successfully created and assigned."})


    def test_create_skill_with_duplicate_name(self):

        json_data = {
            "skill_name": "Project Management", 
            "skill_desc": "Code OOP", 
            "skill_status": "Active",
            "courses": ["IS111"]
        }

        response = self.client.post("/skills/create", data=json.dumps(json_data), content_type="application/json")
        self.assertTrue(response.status_code == 400)
        self.assertEquals(response.json, {"message": "Skill Name already exists."})


    def test_delete_skill(self, skill_id="1"):

        endpoint_call = self.client.post("/skills/" + skill_id + "/delete_skill")
        self.assertTrue(endpoint_call.status_code == 200)
        self.assertEquals(endpoint_call.json, {"message": "Skill successfully deleted."})

        skill_to_assert = self.client.get("/skills/" + skill_id)
        self.assertEquals(skill_to_assert.json["data"]["skill_status"], "Retired") # Check if skill has been retired


    def test_edit_skill(self):

        edited_skill = {
            "skill_id": 1,
            "skill_name": "Problem Solving",
            "skill_desc": "Learn to solve problems",
            "skill_status": "Active",
            "courses": ["3"]
        }

        edited_skill_verification = {
            "skill_desc": "Learn to solve problems",
            "skill_id": 1,
            "skill_name": "Problem Solving",
            "skill_status": "Active"
        }

        endpoint_call = self.client.put("/skills/edit_skill", data = json.dumps(edited_skill), content_type = "application/json")
        self.assertTrue(endpoint_call.status_code == 201)
        self.assertEquals(endpoint_call.json, {"message": "Skill successfully edited."})

        edited_skill_to_assert = self.client.get("/skills/1")
        self.assertDictEqual(edited_skill_to_assert.json['data'], edited_skill_verification) # Check if skill is edited


    def test_edit_skill_with_duplicate_name(self):

        edited_skill = {
            "skill_id": 1,
            "skill_name": "Project Management", # Same skill name as skill_2
            "skill_desc": "Learn to manage solutions",
            "skill_status": "Active",
            "courses": ["3"]
        }

        endpoint_call = self.client.put("/skills/edit_skill", data = json.dumps(edited_skill), content_type = "application/json")
        self.assertTrue(endpoint_call.status_code == 400)
        self.assertEquals(endpoint_call.json, {"message": "Skill Name already exists."})


    def test_edit_skill_with_same_name(self):

        edited_skill = {
            "skill_id": 1,
            "skill_name": "Solution Management", # Same skill name as skill_1
            "skill_desc": "Learn to manage solutions",
            "skill_status": "Active",
            "courses": ["3"]
        }

        endpoint_call = self.client.put("/skills/edit_skill", data = json.dumps(edited_skill), content_type = "application/json")
        self.assertTrue(endpoint_call.status_code == 201)
        self.assertEquals(endpoint_call.json, {"message": "Skill successfully edited."})


    def test_edit_skill_with_duplicate_course(self):

        edited_skill = {
            "skill_id": 2,
            "skill_name": "Project Management", # Same skill name as skill_2
            "skill_desc": "Learn to manage projects",
            "skill_status": "Active",
            "courses": ["3", "3"]
        }

        endpoint_call = self.client.put("/skills/edit_skill", data = json.dumps(edited_skill), content_type = "application/json")
        self.assertTrue(endpoint_call.status_code == 406)
        self.assertEquals(endpoint_call.json, {"message": "Duplicate courses detected. Please try again."})
