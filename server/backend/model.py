from . import db


class Role(db.Model):
    __tablename__ = "role"

    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), nullable=False)

    def __init__(self, role_id, role_name):
        self.role_id = role_id
        self.role_name = role_name

    def json(self):
        return { "role_id": self.role_id, "role_name": self.role_name }


class Staff(db.Model):
    __tablename__ = "staff"

    staff_id = db.Column(db.String(20), primary_key=True)
    staff_fname = db.Column(db.String(50), nullable=False)
    staff_lname = db.Column(db.String(50), nullable=False)
    dept = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    role_id = db.Column(db.Integer, nullable=False)

    def __init__(self, staff_id, staff_fname, staff_lname, dept, email, role_id):
        self.staff_id = staff_id
        self.staff_fname = staff_fname
        self.staff_lname = staff_lname
        self.dept = dept
        self.email = email
        self.role_id = role_id

    def json(self): 
        return { "staff_id": self.staff_id, "staff_fname": self.staff_fname, "staff_lname": self.staff_lname, "dept": self.dept, "email": self.email, "role_id": self.role_id }


class Position(db.Model):
    __tablename__ = "position"

    position_id = db.Column(db.Integer, primary_key=True) 
    position_name = db.Column(db.String(50), nullable=False)
    position_desc = db.Column(db.String(255), nullable=False)
    position_dept = db.Column(db.String(20), nullable=False)
    position_res = db.Column(db.String(1000), nullable=False)
    position_status = db.Column(db.String(10), nullable=False)

    def __init__(self, position_id, position_name, position_desc, position_dept, position_res, position_status):
        self.position_id = position_id
        self.position_name = position_name
        self.position_desc = position_desc
        self.position_dept = position_dept
        self.position_res = position_res
        self.position_status = position_status

    def json(self): 
        return { "position_id": self.position_id, "position_name": self.position_name, "position_desc": self.position_desc, "position_dept": self.position_dept, "position_res": self.position_res, "position_status": self.position_status }


class Skill(db.Model): 
    __tablename__ = 'skill' 

    skill_id = db.Column(db.Integer, primary_key=True) 
    skill_name = db.Column(db.String(50), nullable=False) 
    skill_desc = db.Column(db.String(255), nullable=False) 
    skill_status = db.Column(db.String(10), nullable=False)

    def __init__(self, skill_id, skill_name, skill_desc, skill_status): 
        self.skill_id = skill_id
        self.skill_name = skill_name 
        self.skill_desc = skill_desc
        self.skill_status = skill_status 

    def json(self): 
        return { "skill_id": self.skill_id, "skill_name": self.skill_name, "skill_desc": self.skill_desc, "skill_status": self.skill_status } 


class Course(db.Model): 
    __tablename__ = 'course' 

    course_id = db.Column(db.String(20), primary_key=True) 
    course_name = db.Column(db.String(50), nullable=False) 
    course_desc = db.Column(db.String(255), nullable=False) 
    course_status = db.Column(db.String(15), nullable=False)
    course_type = db.Column(db.String(10), nullable=False)
    course_category = db.Column(db.String(50), nullable=False)

    def __init__(self, course_id, course_name, course_desc, course_status, course_type, course_category): 
        self.course_id = course_id 
        self.course_name = course_name 
        self.course_desc = course_desc
        self.course_status = course_status 
        self.course_type = course_type
        self.course_category = course_category

    def json(self): 
        return { "course_id": self.course_id, "course_name": self.course_name, "course_desc": self.course_desc, "course_status": self.course_status, "course_type": self.course_type, "course_category": self.course_category } 


class PositionSkill(db.Model):
    __tablename__ = "position_skill"

    position_id = db.Column(db.Integer, primary_key=True)
    skill_id = db.Column(db.Integer, primary_key=True)
   
    def __init__(self, position_id, skill_id):
        self.position_id = position_id
        self.skill_id = skill_id

    def json(self):
        return { "position_id": self.position_id, "skill_id": self.skill_id }


class SkillCourse(db.Model): 
    __tablename__ = 'skill_course' 

    skill_id = db.Column(db.Integer, primary_key=True) 
    course_id = db.Column(db.String(20), primary_key=True) 

    def __init__(self, skill_id, course_id): 
        self.skill_id = skill_id 
        self.course_id = course_id 

    def json(self): 
        return { "skill_id": self.skill_id, "course_id": self.course_id }


class StaffSkill(db.Model):
    __tablename__ = "staff_skill"

    staff_id = db.Column(db.Integer, primary_key=True)
    skill_id = db.Column(db.Integer, primary_key=True)

    def __init__(self, staff_id, skill_id):
        self.staff_id = staff_id
        self.skill_id = skill_id

    def json(self):
        return { "staff_id": self.staff_id, "skill_id": self.skill_id }


class LearningJourney(db.Model):
    __tablename__ = "learning_journey"

    lj_id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, nullable=False)
    position_id = db.Column(db.Integer, nullable=False)
    skill_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.String(20), primary_key=True)

    def __init__(self, lj_id, staff_id, position_id, skill_id, course_id):
        self.lj_id = lj_id
        self.staff_id = staff_id
        self.position_id = position_id
        self.skill_id = skill_id
        self.course_id = course_id

    def json(self): 
        return { "lj_id": self.lj_id, "staff_id": self.staff_id, "position_id": self.position_id, "skill_id": self.skill_id, "course_id": self.course_id }
