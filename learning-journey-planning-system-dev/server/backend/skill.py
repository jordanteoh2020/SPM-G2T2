from flask import Blueprint, request, jsonify

from . import db

from .model import Position, Skill, Course, SkillCourse, PositionSkill, StaffSkill
from sqlalchemy import func
import string

skill = Blueprint("skill", __name__)


@skill.route("all")
def get_all_skills():
    skills = Skill.query.all() 
    if skills: 
        return jsonify ( 
            {
                "data": [skill.json() for skill in skills]
            }
        )
    return jsonify(
        {
            "message": "There are no skills."
        }
    ), 404


@skill.route("active")
def get_all_active_skills():
    skills = Skill.query.filter_by(skill_status="Active").all()

    if skills: 
        return jsonify ( 
            {
                "data": [skill.json() for skill in skills]
            }
        )
    return jsonify(
        {
            "message": "There are no active skills."
        }
    ), 404


@skill.route("<int:skill_id>")
def get_skill_by_id(skill_id):
    skill = Skill.query.get(skill_id)
    if skill:
        return jsonify(
            {
                "data": skill.json()
            }
        )
    return jsonify(
        {
            "message": "Skill not found."
        }
    ), 404


@skill.route('<int:skill_id>/positions')
def get_positions_by_skill(skill_id):
    positions = db.session.query(Position).filter(Position.position_id==PositionSkill.position_id, PositionSkill.skill_id==skill_id).all()

    if positions:
        return jsonify (
            {
                "data": [position.json() for position in positions]
            }
        )
    return jsonify(
        {
            "message": "There are no positions requiring this skill."
        }
    ), 404


@skill.route('<int:skill_id>/positions/active')
def get_active_positions_by_skill(skill_id):
    positions = db.session.query(Position).filter(Position.position_id==PositionSkill.position_id, PositionSkill.skill_id==skill_id, Position.position_status=="Active").all()

    if positions:
        return jsonify (
            {
                "data": [position.json() for position in positions]
            }
        )
    return jsonify(
        {
            "message": "There are no active positions requiring this skill."
        }
    ), 404


#FUNCTION 3: Filter courses by skill_id
@skill.route("<int:skill_id>/courses")
def get_courses_by_skill(skill_id):
    courses = db.session.query(Course).filter(SkillCourse.course_id==Course.course_id, SkillCourse.skill_id==skill_id).all()

    if courses: 
        return jsonify( 
            {
                "data": [course.json() for course in courses]
            } 
        )
    return jsonify( 
        {
            "message": "There are no courses teaching this skill." 
        } 
    ), 404 


#FUNCTION 4: Filter ACTIVE courses by skill_id
@skill.route("<int:skill_id>/courses/active") 
def get_active_courses_by_skill(skill_id):
    courses = db.session.query(Course).filter(SkillCourse.course_id==Course.course_id, SkillCourse.skill_id==skill_id, Course.course_status=="Active").all()

    if courses: 
        return jsonify( 
            {
                "data": [course.json() for course in courses]
            } 
        )
    return jsonify( 
        {
            "message": "There are no active courses teaching this skill." 
        } 
    ), 404


@skill.route("skill_course", methods=["POST"])
def get_skill_course():
    skillCourse = request.get_json()
    skillCourseRecords = [[], []]
    skillIDs = set(skillCourse["skill_ids"])

    skillCoursePairs = SkillCourse.query.filter(SkillCourse.course_id.in_(skillCourse["course_ids"])).all()

    for pair in skillCoursePairs:
        if str(pair.skill_id) in skillIDs:
            skillCourseRecords[0].append(pair.skill_id)
            skillCourseRecords[1].append(pair.course_id)

    if skillCourseRecords[0]: 
        return jsonify( 
            {
                "data": skillCourseRecords
            } 
        )
    return jsonify( 
        {
            "message": "There are no skills for these courses." 
        } 
    ), 404 


#FUNCTION 2: Add a skill and assign it to selected courses
@skill.route("create", methods=['POST']) 
def create_skill(): 

    data = request.get_json() 

    #2.1 Check for duplicates in courses
    courses = data['courses']

    def checkIfDuplicates_1(listOfElems):
        if len(listOfElems) == len(set(listOfElems)):
            return False
        else:
            return True

    result = checkIfDuplicates_1(courses)
    if result:
        return jsonify( 
            {
                "message": "Duplicate courses detected. Please try again." 
            } 
        ), 406

    #2.2 Add skill
    skill_name = string.capwords(data['skill_name'])

    if (Skill.query.filter_by(skill_name=skill_name).first()): 
        return jsonify( 
            {
                "message": "Skill Name already exists." 
            } 
        ), 400 

    max_skill_id = db.session.query(func.max(Skill.skill_id)).first()

    if(max_skill_id[0] == None):
        incremented_skill_id = 1
    else:
        max_skill_id = int(max_skill_id[0])
        incremented_skill_id = max_skill_id + 1

    skill = Skill(incremented_skill_id, string.capwords(data['skill_name']), data['skill_desc'], data['skill_status']) 

    try: 
        db.session.add(skill) 
        db.session.commit() 

    except: 
        return jsonify( 
            {
                "message": "An error occurred creating the skill." 
            } 
        ), 500 
    
    #2.3 assigning skill to courses
    courses = data['courses']

    for course_id in courses:
        # course_obj = Course.query.filter_by(course_id=course_id).first().json()
        # new_course_obj = Course(course_obj['course_id'], course_obj['course_name'], course_obj['course_desc'], course_obj['course_status'], course_obj['course_type'], course_obj['course_category'], incremented_skill_id)

        skill_course_obj = SkillCourse(incremented_skill_id, course_id)

        try: 
            db.session.add(skill_course_obj) 
            db.session.commit() 

        except:
            return jsonify( 
                {
                    "message": "An error occurred assigning the skill." 
                } 
            ), 500 
    
    return jsonify( 
        {
            "message": "Skill successfully created and assigned."
        } 
    ), 201 


@skill.route("<int:skill_id>/delete_skill", methods=['POST'])
def delete_skill(skill_id):

    # Edit skill from skill table "Active" -> "Retired"
    
    skill_table_delete = Skill.query.filter_by(skill_id=skill_id).first()

    skill_table_delete.skill_status = "Retired"

    try:
        db.session.commit()
        
    except: 
        return jsonify( 
            {
                "message": "An error occurred editing the skill." 
            } 
        ), 500 

    # Delete skill from skill_course table

    skill_course_table_delete = SkillCourse.query.filter_by(skill_id=skill_id).all()

    for skill in skill_course_table_delete:
        try:
            db.session.delete(skill)
            db.session.commit()
        
        except: 
            return jsonify( 
                {
                    "message": "An error occurred deleting the skill from the skill_course table." 
                } 
            ), 500 

    # Delete skill from position_skill table

    position_skill_table_delete = PositionSkill.query.filter_by(skill_id=skill_id).all()

    for skill in position_skill_table_delete:
        try:
            db.session.delete(skill)
            db.session.commit()
        
        except: 
            return jsonify( 
                {
                    "message": "An error occurred deleting the skill from the position_skill table." 
                } 
            ), 500 

    # Delete skill from staff_skill table

    staff_skill_table_delete = StaffSkill.query.filter_by(skill_id=skill_id).all()

    for skill in staff_skill_table_delete:
        try:
            db.session.delete(skill)
            db.session.commit()
        
        except: 
            return jsonify( 
                {
                    "message": "An error occurred deleting the skill from the staff_skill table." 
                } 
            ), 500 

    
    return jsonify( 
        {
            "message": "Skill successfully deleted."
        } 
    )


@skill.route("/edit_skill", methods=['PUT'])
def edit_skill():
    
    front_end_json = request.get_json()
    
    skill_id = front_end_json['skill_id']
    new_skill_name = front_end_json['skill_name']
    new_skill_desc = front_end_json['skill_desc']
    new_skill_status = front_end_json['skill_status']
    new_skill_courses = front_end_json['courses']

    def checkIfDuplicates_1(listOfElems):
        if len(listOfElems) == len(set(listOfElems)):
            return False
        else:
            return True

    result = checkIfDuplicates_1(new_skill_courses)
    if result:
        return jsonify( 
            {
                "message": "Duplicate courses detected. Please try again." 
            } 
        ), 406

    #check if edited name is duplicated

    skill_name_check = Skill.query.filter_by(skill_name = string.capwords(new_skill_name)).first()

    if (skill_name_check and skill_name_check.skill_id != skill_id): 
        return jsonify( 
            {
                "message": "Skill Name already exists." 
            } 
        ), 400 

    #Edit skill in skill table

    skill_to_edit = Skill.query.filter_by(skill_id=skill_id).first()

    skill_to_edit.skill_name = new_skill_name
    skill_to_edit.skill_desc = new_skill_desc
    skill_to_edit.skill_status = new_skill_status

    try:
        db.session.commit()
        
    except: 
        return jsonify( 
            {
                "message": "An error occurred editing the skill." 
            } 
        ), 500 


    # Edit skill in skill_course table

    skills_to_delete = SkillCourse.query.filter_by(skill_id=skill_id).all()

    for skill in skills_to_delete:
        try:
            db.session.delete(skill)
            db.session.commit()
        
        except: 
            return jsonify( 
                {
                    "message": "An error occurred deleting the skill from the skill_course table." 
                } 
            ), 500 

    for course in new_skill_courses:

        skill_course_to_add = SkillCourse(skill_id, course)

        try:
            db.session.add(skill_course_to_add)
            db.session.commit()
        
        except: 
            return jsonify( 
                {
                    "message": "An error occurred adding the skill to the skill_course table." 
                } 
            ), 500 

    return jsonify( 
    {
        "message": "Skill successfully edited."
    } 
    ), 201
    
    

#FUNCTION 5: Assign courses to the created skill (assigning different courses to a skill_id)
@skill.route("assign_course", methods=['POST']) 
def create_skill_course(): 

    data = request.get_json()
    courses = data['courses']
    skill_id = int(data["skill_id"])

    for course_id in courses:
        
        course_obj = Course.query.filter_by(course_id=course_id).first().json()
        new_course_obj = Course(course_obj['course_id'], course_obj['course_name'], course_obj['course_desc'], course_obj['course_status'], course_obj['course_type'], course_obj['course_category'], skill_id)
        
        try: 
            db.session.add(new_course_obj) 
            db.session.commit() 

        except:
            return jsonify( 
                {
                    "message": "An error occurred creating the skill." 
                } 
            ), 500 

    return jsonify( 
        {
            "message": "Skill successfully created."
        } 
    ), 201

#FUNCTION 6: Delete skill from courses (delete course entry by course_id and skill_id)
@skill.route("<int:skill_id>/unassign_course", methods=['POST'])
def delete_skill_course(skill_id):

    data = request.get_json() #Pass course_id's to be deleted in a list with key: "to_delete"

    for course_id in data["to_delete"]:
        course_to_delete = Course.query.filter_by(course_id=course_id, skill_id=skill_id)

        try:
            db.session.delete(course_to_delete)
            db.session.commit()
        
        except: 
            return jsonify( 
                {
                    "message": "An error occurred editing the skill." 
                } 
            ), 500 
    return jsonify( 
        {
            "message": "Skill successfully edited."
        } 
    )
