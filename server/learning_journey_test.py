import unittest

import json
from main import app
from backend import db

from backend.model import Position, Skill, Course, LearningJourney

class TestLearningJourney(unittest.TestCase): 

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
            
            learning_journey_1 = LearningJourney(
                lj_id = 1, 
                staff_id = "S1234", 
                position_id = 1, 
                skill_id = 1, 
                course_id = "IS212")

            db.session.add(position_1)
            db.session.add(skill_1)
            db.session.add(skill_2)
            db.session.add(course_1)
            db.session.add(course_2)
            db.session.add(course_3)
            db.session.add(learning_journey_1)
            

    def tearDown(self):
        db.session.remove()
        db.drop_all()


    def test_create_learning_journey_with_no_lj_id(self):

        json_data = {
            "lj_id": 0,
            "staff_id": "S1234", 
            "position_id": 1, 
            "skill_course": [ [1, 2], ["IS212", "IS111"] ] 
        }

        response = self.client.post("/learning_journeys/create", data=json.dumps(json_data), content_type="application/json")
        self.assertTrue(response.status_code == 201)
        self.assertEquals(response.json['message'], "Learning Journey has been successfully created.")


    def test_create_learning_journey_with_lj_id(self):

        json_data = {
            "lj_id": 2,
            "staff_id": "S1234", 
            "position_id": 1, 
            "skill_course": [ [1, 2], ["IS212", "IS111"] ] 
        }

        response = self.client.post("/learning_journeys/create", data=json.dumps(json_data), content_type="application/json")
        self.assertTrue(response.status_code == 201)
        self.assertEquals(response.json['message'], "Learning Journey has been successfully created.")


    def test_delete_learning_journey(self, lj_id="1"):
        response = self.client.post("/learning_journeys/" + lj_id + "/delete")
        self.assertTrue(response.status_code == 200)
