from flask import Blueprint, request, jsonify

from . import db, course

from .model import Position, Skill, SkillCourse, Course, LearningJourney

from sqlalchemy import func

learning_journey = Blueprint("learning_journey", __name__)


@learning_journey.route('all') 
def get_all_learning_journeys():

    learning_journeys = LearningJourney.query.all()

    if learning_journeys:
        return jsonify ( 
            {
                "data": [learning_journey.json() for learning_journey in learning_journeys]
            }
        )
    return jsonify(
        {
            "message": "There are no learning journeys."
        }
        ), 404


@learning_journey.route("/create", methods=['POST'])
def create_learning_journey():

    learning_journey = request.get_json()
    lj_id = learning_journey['lj_id']
    skillIDs = learning_journey['skill_course'][0]
    courseIDs = learning_journey['skill_course'][1]

    if not lj_id:
        max_lj_id = db.session.query(func.max(LearningJourney.lj_id)).first()
        if max_lj_id[0] == None:
            lj_id = 1
        else:
            lj_id = max_lj_id[0] + 1

    for i in range(len(skillIDs)):
        try:
            db.session.add(LearningJourney(lj_id, learning_journey['staff_id'], learning_journey['position_id'], skillIDs[i], courseIDs[i]))
            db.session.commit()
        except:
            return jsonify(
                {
                    "message": "An error occurred while creating the Learning Journey."
                }
            ), 500
    return jsonify(
        {
            "message": "Learning Journey has been successfully created."
        }
    ), 201  


@learning_journey.route("/<int:lj_id>/delete", methods=['POST'])
def delete_learning_journey(lj_id):
    
    lj_to_delete = LearningJourney.query.filter_by(lj_id=lj_id).all()

    for lj in lj_to_delete:
        try:   
            db.session.delete(lj)
            db.session.commit()
        
        except: 
            return jsonify( 
                { 
                    "data": {}, 
                    "message": "An error occurred while deleting the learning journey." 
                } 
            ), 500 
    return jsonify( 
        { 
            "message": "Learning Journey has been successfully deleted."
        } 
    )


@learning_journey.route("/<int:lj_id>/filterLearningjourneyById", methods=['GET'])
def filter_learning_journey_by_id(lj_id):
    
    learning_journeys = LearningJourney.query.filter_by(lj_id=lj_id).all()

    if learning_journeys:
        return jsonify ( 
            {
                "data": [learning_journey.json() for learning_journey in learning_journeys]
            }
        )
    return jsonify(
        {
            "message": "An error occured filtering the learning journey's by LJID."
        }
        ), 404


# @learning_journey.route("/edit", methods=['PUT'])
# def edit_learning_journey():

#     learning_journey = request.get_json()
#     lj_id = learning_journey['lj_id']
#     position_id = learning_journey['position_id']
#     skillIDs = learning_journey['skill_course'][0]
#     courseIDs = learning_journey['skill_course'][1]

#     print(lj_id)

#     delete_learning_journey(lj_id)
#     create_learning_journey(lj_id)

#     # skillIDs = learningjourney['skill_course'][0]
#     # courseIDs = learningjourney['skill_course'][1]

#     # front_end_json = request.get_json()
#     # print(front_end_json["params"]["ljid"])

#     # lj_id = front_end_json["params"]["ljid"]
#     # role = front_end_json["params"]["role"]
#     # courses = front_end_json["params"]["courses"]
#     # skills = front_end_json["params"]["skills"]

#     return ""