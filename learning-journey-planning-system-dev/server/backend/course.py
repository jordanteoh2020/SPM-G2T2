from flask import Blueprint, jsonify

from . import db

from .model import Skill, Course, SkillCourse

course = Blueprint("course", __name__)


@course.route("all")
def get_all_courses(): 
    courses = Course.query.all() 
    if courses:
        return jsonify( 
            {
                "data": [course.json() for course in courses]
            } 
        )
    return jsonify( 
        {
            "message": "There are no courses." 
        } 
    ), 404 


@course.route("active")
def get_all_active_courses():
    courses = Course.query.filter_by(course_status="Active").all()

    if courses: 
        return jsonify ( 
            {
                "data": [course.json() for course in courses]
            }
        )
    return jsonify(
        {
            "message": "There are no active courses."
        }
    ), 404


@course.route("<string:course_id>/skills")
def get_skills_by_course(course_id):
    skills = db.session.query(Skill).filter(Skill.skill_id==SkillCourse.skill_id, SkillCourse.course_id==course_id).all()

    if skills: 
        return jsonify( 
            {
                "data": [skill.json() for skill in skills]
            } 
        )
    return jsonify( 
        {
            "message": "There are no skills taught in this course." 
        } 
    ), 404 


@course.route("<string:course_id>/skills/active")
def get_active_skills_by_course(course_id):
    skills = db.session.query(Skill).filter(Skill.skill_id==SkillCourse.skill_id, SkillCourse.course_id==course_id, Skill.skill_status=="Active").all()

    if skills: 
        return jsonify( 
            {
                "data": [skill.json() for skill in skills]
            } 
        )
    return jsonify( 
        {
            "message": "There are no active skills taught in this course." 
        } 
    ), 404 
