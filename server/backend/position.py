from flask import Blueprint, request, jsonify

import json
from . import db

from sqlalchemy import func
from .model import Position, Skill, PositionSkill

position = Blueprint("position", __name__)


@position.route('all')
def get_all_positions():
    positions = Position.query.all() 
    if positions:
        return jsonify (
            {
                "data": [position.json() for position in positions]
            }
        )
    return jsonify(
        {
            "message": "There are no positions."
        }
    ), 404


@position.route("active")
def get_active_positions():
    positions = Position.query.filter_by(position_status="Active").all()
    if positions:
        return jsonify (
            {
                "data": [position.json() for position in positions]
            }
        )
    return jsonify(
        {
            "message": "There are no active positions."
        }
    ), 404


@position.route('<int:position_id>/skills')
def get_skills_by_position(position_id):
    skills = db.session.query(Skill).filter(PositionSkill.skill_id==Skill.skill_id, PositionSkill.position_id==position_id).all()

    if skills:
        return jsonify (
            {
                "data": [skill.json() for skill in skills]
            }
        )
    return jsonify(
        {
            "message": "There are no skills for this position."
        }
    ), 404


@position.route('<int:position_id>/skill_ids')
def get_skill_ids_by_position(position_id):
    skills = db.session.query(Skill.skill_id).filter(PositionSkill.skill_id==Skill.skill_id, PositionSkill.position_id==position_id).all()
    print(type(skills))

    if skills:
        return jsonify (
            {
                "data": [skill[0] for skill in skills]
            }
        )
    return jsonify(
        {
            "message": "There are no skills for this position."
        }
    ), 404


@position.route('<int:position_id>/skills/active')
def get_active_skills_by_position(position_id):
    skills = db.session.query(Skill).filter(PositionSkill.skill_id==Skill.skill_id, PositionSkill.position_id==position_id, Skill.skill_status=="Active").all()

    if skills:
        return jsonify (
            {
                "data": [skill.json() for skill in skills]
            }
        )
    return jsonify(
        {
            "message": "There are no active skills for this position."
        }
    ), 404


@position.route("create", methods=['POST'])
def create_position():

    position = request.get_json()
    print(type(position)) #dict 
    positionName = position['position_name']

    if (Position.query.filter_by(position_name=positionName).first()):
        return jsonify(
            {
                "message": "Position Name already exists."
            }
        ), 400

    max_position_id = db.session.query(func.max(Position.position_id)).first()
    print(max_position_id)

    if max_position_id[0] == None:
        positionID = 1
    else:
        positionID = max_position_id[0] + 1

    positionDesc = position['position_desc']
    positionDept = position['position_dept']
    positionRes = position['position_res']
    positionStatus = position['position_status']
    positionSkills = position['position_skills']

    print(positionID, positionName, positionDesc, positionDept, positionRes, positionStatus)
    position = Position(positionID, positionName, positionDesc, positionDept, positionRes, positionStatus)
    print(position)

    try:
        db.session.add(position)
        db.session.commit()

        for skillID in positionSkills:
            create_position_skill(positionID, skillID)

    except:
        return jsonify(
            {
                "message": "An error occurred creating the position."
            }
        ), 500
 
    return jsonify(
        {
            "data": position.json()
        }
    ), 201


# @position.route("assign_skill", methods=['POST'])
def create_position_skill(position_id, skill_id):

    positionID = position_id
    skillID = skill_id

    print(positionID, skillID)
    position = PositionSkill(positionID, skillID)
    print(position)
 
    try:
        db.session.add(position)
        db.session.commit()
    except:
        return jsonify(
            {
                "message": "An error occurred adding the position and skill."
            }
        ), 500
 
    return jsonify(
        {
            "data": position.json()
        }
    ), 201


# @position.route("unassign_skill", methods=['DELETE'])
def delete_position_skill(position_id, skill_id):

    positionID = position_id
    skillID = skill_id

    position_to_delete = PositionSkill.query.filter_by(position_id=positionID, skill_id=skillID).first()
 
    try:
        db.session.delete(position_to_delete)
        db.session.commit()
    except:
        return jsonify(
            {
                "message": "An error occurred deleting the position and skill."
            }
        ), 500
 
    return jsonify(
        {
            "message": "Position and Skill have been successfully deleted."
        }
    )


@position.route("edit", methods=['PUT'])
def edit_position():

    position = request.get_json()
    print(type(position)) #dict 
    positionID = position['position_id']
    positionName = position['position_name']

    positions = Position.query.filter_by(position_name=positionName)
    print(positions)

    for position_in_db in positions:
        if position_in_db.position_id != positionID:
            return jsonify(
                {
                    "message": "Position Name already exists."
                }
            ), 400

    positionDesc = position['position_desc']
    positionDept = position['position_dept']
    positionRes = position['position_res']
    positionStatus = position['position_status']
    skillIDs = position['position_skills']

    print(skillIDs)

    position_to_edit = Position.query.filter_by(position_id=positionID).first()
    position_to_edit.position_name = positionName
    position_to_edit.position_desc = positionDesc
    position_to_edit.position_dept = positionDept
    position_to_edit.position_res = positionRes
    position_to_edit.position_status = positionStatus
    
    current_skills_response = get_skill_ids_by_position(positionID)
    print(current_skills_response)
    # print(json.loads(current_skills_response.data)['data'])
    current_skills = json.loads(current_skills_response.data)['data']
    current_skills_set = set(current_skills)
    # if not in skillIDs => to delete
    # if not in current_skills => to add
    for skill_to_add in skillIDs:
        if skill_to_add not in current_skills_set:
            create_position_skill(positionID, skill_to_add)
    
    for skill_to_delete in current_skills:
        if skill_to_delete not in skillIDs:
            delete_position_skill(positionID, skill_to_delete)

    try:
        db.session.commit()
    except:
        return jsonify(
            {
                "message": "An error occurred editting the position."
            }
        ), 500
 
    return jsonify(
        {
            "message": "Position has been successfully editted."
        }
    )