import unittest

import json
from main import app
from backend import db

from backend.model import Course, Skill, SkillCourse

class TestCourse(unittest.TestCase): 

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

            course_3 = Course(
                course_id = "FN101", 
                course_name = "Intro to Finance", 
                course_desc = "Learn how to manage finances", 
                course_status = "Pending", 
                course_type = "External", 
                course_category = "Finance")
            
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
            
            skill_course_1 = SkillCourse(1, "IS212")
            skill_course_2 = SkillCourse(2, "IS212")

            db.session.add(course_1)
            db.session.add(course_2)
            db.session.add(course_3)
            db.session.add(skill_1)
            db.session.add(skill_2)
            db.session.add(skill_course_1)
            db.session.add(skill_course_2)
            

    def tearDown(self):
        db.session.remove()
        db.drop_all()


    def test_get_all_courses(self):
        response = self.client.get("/courses/all")
        self.assertTrue(response.status_code == 200)
        self.assertEquals(len(response.json['data']), 3)
        self.assertListEqual(response.json['data'],[{
            "course_id": "IS212", 
            "course_name": "Software Project Management", 
            "course_desc": "Learn how to manage software projects and deliver value", 
            "course_status": "Active", 
            "course_type": "Internal", 
            "course_category": "Technical"}, {
            "course_id": "IS111", 
            "course_name": "Intro to Programming", 
            "course_desc": "Learn how to problem solve in Python", 
            "course_status": "Retired", 
            "course_type": "External", 
            "course_category": "Technical"}, {
            "course_id": "FN101", 
            "course_name": "Intro to Finance", 
            "course_desc": "Learn how to manage finances", 
            "course_status": "Pending", 
            "course_type": "External", 
            "course_category": "Finance"}])


    def test_get_all_active_courses(self):
        response = self.client.get("/courses/active")
        self.assertTrue(response.status_code == 200)
        self.assertEquals(len(response.json['data']), 1)
        self.assertListEqual(response.json['data'],[{ 
            "course_id": "IS212", 
            "course_name": "Software Project Management", 
            "course_desc": "Learn how to manage software projects and deliver value", 
            "course_status": "Active", 
            "course_type": "Internal", 
            "course_category": "Technical"}])


    def test_get_skills_by_course(self, course_id="IS212"):
        response = self.client.get("/courses/" + course_id + "/skills")
        self.assertTrue(response.status_code == 200)
        self.assertEquals(len(response.json['data']), 2)
        self.assertListEqual(response.json['data'],[{ 
            "skill_id": 1, 
            "skill_name": "Scrum",
            "skill_desc": "Being effective and efficient in the process", 
            "skill_status": "Active"}, {
            "skill_id": 2, 
            "skill_name": "Python Programming",
            "skill_desc": "Code in Python", 
            "skill_status": "Retired"}])
    

    def test_get_active_skills_by_course(self, course_id="IS212"):
        response = self.client.get("/courses/" + course_id + "/skills/active")
        self.assertTrue(response.status_code == 200)
        self.assertEquals(len(response.json['data']), 1)
        self.assertListEqual(response.json['data'],[{ 
            "skill_id": 1, 
            "skill_name": "Scrum",
            "skill_desc": "Being effective and efficient in the process", 
            "skill_status": "Active"
        }])
    