import unittest

import json
from main import app
from backend import db

from backend.model import Role, Staff, StaffSkill, Position, Skill, Course, PositionSkill, SkillCourse, LearningJourney

class TestStaff(unittest.TestCase): 

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

            staff_1 = Staff(
                staff_id = "S1234", 
                staff_fname = "Bob", 
                staff_lname = "Tan", 
                dept = "Finance", 
                email = "Bob.Tan@allinone.com.sg",
                role_id = 1
            )

            role_1 = Role(
                role_id = 1, 
                role_name = "Admin"
            )

            position_1 = Position(
                position_id = 1,
                position_name = "Software Engineer", 
                position_desc = "Code reusable components", 
                position_dept = "IT Team", 
                position_res = "Code 24 hours per day", 
                position_status = "Active"
            )

            skill_1 = Skill(
                skill_id = 1, 
                skill_name = "Scrum",
                skill_desc = "Being effective and efficient in the process", 
                skill_status = "Active"
            )

            skill_2 = Skill(
                skill_id = 2, 
                skill_name = "Python Programming",
                skill_desc = "Code in Python", 
                skill_status = "Retired"
            )

            course_1 = Course(
                course_id = "IS212", 
                course_name = "Software Project Management", 
                course_desc = "Learn how to manage software projects and deliver value", 
                course_status = "Active", 
                course_type = "Internal", 
                course_category = "Technical")
            
            position_skill_1 = PositionSkill(1, 1)
            skill_course_1 = SkillCourse(1, "IS212")
            staff_skill_1 = StaffSkill("S1234", 1)
            staff_skill_2 = StaffSkill("S1234", 2)

            learning_journey_1 = LearningJourney(
                lj_id = 1, 
                staff_id = "S1234", 
                position_id = 1, 
                skill_id = 1, 
                course_id = "IS212")

            db.session.add(staff_1)
            db.session.add(role_1)
            db.session.add(position_1)
            db.session.add(skill_1)
            db.session.add(skill_2)
            db.session.add(course_1)
            db.session.add(position_skill_1)
            db.session.add(skill_course_1)
            db.session.add(staff_skill_1)
            db.session.add(staff_skill_2)
            db.session.add(learning_journey_1)
            

    def tearDown(self):
        db.session.remove()
        db.drop_all()


    def test_get_role_by_staff(self, staff_id="S1234"):
        response = self.client.get("/staff/" + staff_id + "/role")
        self.assertTrue(response.status_code == 200)
        self.assertDictEqual(response.json['data'], { 
            "role_id": 1,
            "role_name": "Admin"})

    
    def test_get_skills_by_staff(self, staff_id="S1234"):
        response = self.client.get("/staff/" + staff_id + "/skill_ids")
        self.assertTrue(response.status_code == 200)
        self.assertEquals(len(response.json['data']), 2)
        self.assertListEqual(response.json['data'], [ 1 , 2 ])


    def test_get_learning_journeys_by_staff(self, staff_id="S1234"):
        response = self.client.get("/staff/" + staff_id + "/learning_journeys")
        self.assertTrue(response.status_code == 200)
        self.assertEquals(len(response.json['data']), 1)
        self.assertDictEqual(response.json['data'], 
        { "1": { 
            "position" : { 
                "position_id": 1, 
                "position_name": "Software Engineer", 
                "position_status": "Active" }, 
            "course" : [{
                "course_id": "IS212", 
                "course_name": "Software Project Management", 
                "course_status": "Active" }], 
            "skill": [{
                "skill_id": 1, 
                "skill_name": "Scrum", 
                "skill_status": "Active" }]
            }
        })
