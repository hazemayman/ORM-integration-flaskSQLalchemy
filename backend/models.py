from flask_sqlalchemy import SQLAlchemy
from flask import Flask
import sqlalchemy.types as types
import random
from sqlalchemy import text
from flask import Flask, request, jsonify, abort , send_file

import datetime
DATA_BASE_NAME = "mini_grading_sys"
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://postgres:postgres@localhost:5432/{DATA_BASE_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy()
db.init_app(app)

with app.app_context():
    db.reflect()


def get_marks(marks):
    x = marks[1:-1].split(',')
    data = {
        'final' :  x[0],
        'midterm':x[1] ,
        'quizzes'  :x[2],
        'assignmnets' : x[3],
        'project'  : x[4],
        'practical' : x[5] 
    }
    return data

class Doctors(db.Model):
    __tablename__ = 'doctors'
    subjects = db.relationship('Subjects' , back_populates="doctors")

    def as_dict(self):
        data = {
            'student_id' : self.doctor_id,
            'first_name' : self.first_name,
            'last_name' : self.last_name,
            'age' : self.age,
            'email_address' : self.email_address,
            'phone_number' : self.phone_number,
            'gender' : self.gender,
            'degree' : self.degree,
            'salary' : self.salary,
            'doctor_id' : self.doctor_id,
            'subjects' : [{
                'subject_id' : j.subject_id,
                'semester' : j.semester,
                'name' : j.name,
                'marks' : get_marks(j.marks),
                'major' : j.major,
                'credit_hours' : j.credit_hours,
            } for j in self.subjects]
        }
        return data

class Grades(db.Model):
    __tablename__ = 'grades'

    student = db.relationship("Students", back_populates="subjects")
    subject = db.relationship("Subjects", back_populates="students")

    def as_dict(self):
        data = {
            'subject_id' : self.subject_id_fk,
            'student_id' : self.student_id_fk,
            'grade_id' : self.grade_id,
            'marks' : get_marks(self.grade),
            'total' : self.total,
            'student_name' : f'{self.student.first_name} {self.student.last_name}',
            'subject_name' : f'{self.subject.name}',
            'student' : {
                'student_id' : self.student.student_id,
                'first_name' : self.student.first_name,
                'last_name' : self.student.last_name,
                'age' : self.student.age,
                'email_address' : self.student.email_address,
                'phone_number' : self.student.phone_number,
                'gender' : self.student.gender,
                'level' : self.student.level,
                'cgpa' : self.student.cgpa,
                'total_credit_hours' : self.student.total_credit_hours,
            },
            'subject' : {
                'subject_id' : self.subject.subject_id,
                'semester' : self.subject.semester,
                'name' : self.subject.name,
                'marks' : get_marks(self.subject.marks),
                'major' : self.subject.major,
                'credit_hours' : self.subject.credit_hours,
            },
            'doctor' : {
                'first_name' : self.subject.doctors.first_name,
                'last_name' : self.subject.doctors.last_name,
                'age' : self.subject.doctors.age,
                'email_address' : self.subject.doctors.email_address,
                'phone_number' : self.subject.doctors.phone_number,
                'degree' : self.subject.doctors.degree,
                'salary' : self.subject.doctors.salary,

            }

        }
        return data
class Students(db.Model):
    __tablename__ = 'students'
    
    subjects = db.relationship('Grades' , back_populates="student")
    def as_dict(self):
        data = {
            'student_id' : self.student_id,
            'first_name' : self.first_name,
            'last_name' : self.last_name,
            'age' : self.age,
            'email_address' : self.email_address,
            'phone_number' : self.phone_number,
            'gender' : self.gender,
            'level' : self.level,
            'cgpa' : self.cgpa,
            'total_credit_hours' : self.total_credit_hours,
            'subjects' : [
                {
                    'doctor_id' : j.subject.doctor_id_fk,
                    'subject_id' : j.subject.subject_id,
                    'semester' : j.subject.semester,
                    'name' : j.subject.name,
                    'major' : j.subject.major,
                    'credit_hours' : j.subject.credit_hours,
                    'doctor' : f"{j.subject.doctors.first_name} {j.subject.doctors.last_name}" ,
                    'grades' : get_marks(j.grade),
                    'marks_dist' : get_marks(j.subject.marks),

                    'total' : j.total
                } for j in self.subjects
            ]
        }
        return data

class Subjects(db.Model):
    __tablename__ = 'subjects'

    doctors = db.relationship('Doctors' , back_populates="subjects")

    students = db.relationship('Grades' , back_populates="subject")
    def as_dict(self):
        data = {
            'subject_id' : self.subject_id,
            'semester' : self.semester,
            'name' : self.name,
            'marks' : get_marks(self.marks),
            'major' : self.major,
            'credit_hours' : self.credit_hours,
            'doctor' :{
                'first_name' : self.doctors.first_name,
                'last_name' : self.doctors.last_name,
                'age' : self.doctors.age,
                'email_address' : self.doctors.email_address,
                'phone_number' : self.doctors.phone_number,
            } ,
            'students' : [
                {
                    'first_name' : j.student.first_name,
                    'last_name' : j.student.last_name,
                    'total' : j.total,
                    'level' : j.student.level,
                    'cgpa' : j.student.cgpa,
                    'student_id' : j.student.student_id
                } for j in self.students
            ]
        }
        return data


@app.route("/subjects" , methods = ['GET'])
def get_subjects():
    results = db.session.query(Subjects).from_statement(text("select * FROM  Subjects"))
    values = [i.as_dict() for i in results]
    return {'result' : values}

@app.route("/doctors" , methods = ['GET'])
def get_doctors():
    results = db.session.query(Doctors).from_statement(text("select * FROM  doctors"))
    values = [i.as_dict() for i in results]
    return {'result' : values}

@app.route("/students" , methods = ['GET'])
def get_students():
    results = db.session.query(Students).from_statement(text("select * FROM  students"))
    values = [i.as_dict() for i in results]
    return {'result' : values}

@app.route("/grades" , methods = ['GET'])
def get_grades():
    results = db.session.query(Grades).from_statement(text("select * FROM  grades"))
    values = [i.as_dict() for i in results]
    return {'result' : values}

@app.route("/subjects/<int:subject_id>" , methods = ['get'])
def subjects_get_by_id(subject_id):
    results = db.session.query(Subjects).from_statement(text(f"select * FROM  Subjects where subject_id = {subject_id}"))
    values = [i.as_dict() for i in results]
    return {'result' : values}  

@app.route("/students/<int:student_id>" , methods = ['get'])
def students_get_by_id(student_id):
    results = db.session.query(Students).from_statement(text(f"select * FROM  students where  student_id = {student_id}"))
    values = [i.as_dict() for i in results]
    return {'result' : values}  

@app.route("/doctors/<int:doctor_id>" , methods = ['get'])
def doctors_get_by_id(doctor_id):
    results = db.session.query(Doctors).from_statement(text(f"select * FROM  doctors where doctor_id = {doctor_id}"))
    values = [i.as_dict() for i in results]
    return {'result' : values}

@app.route("/grades/<int:grade_id>" , methods = ['get'])
def grades_get_by_id(grade_id):
    results = db.session.query(Grades).from_statement(text(f"select * FROM  grades where grade_id = {grade_id}"))
    values = [i.as_dict() for i in results]
    return {'result' : values}

@app.route("/subjects/create" , methods = ['post'])
def subjects_create():
    payload = request.get_json()['Data']
    data = payload

    if ('semester' in payload):
        payload['semester'] = datetime.date(int(payload['semester'].split('-')[0]),
                                            int(payload['semester'].split('-')[1]),
                                            int(payload['semester'].split('-')[2]))

        data = payload

        results = db.session.execute(text(f"""
            INSERT INTO Subjects (credit_hours, semester,	name	,marks,	major	,doctor_id_fk	) 
            VALUES ({data['credit_hours']} , '{data["semester"]}', '{data["name"]}',
                ROW({data['marks']["final"]}, {data['marks']["midterm"]}, {data['marks']["quizzes"]}, {data['marks']["assignmnets"]} , {data['marks']["project"]} , {data['marks']["practical"]}) ,
                '{data["major"]}', {data["doctor_id_fk"]})
        """))
        db.session.commit()

    else:
        results = db.session.execute(text(f"""
            INSERT INTO Subjects (credit_hours,	name	,marks,	major	,doctor_id_fk	) 
            VALUES ({data['credit_hours']} , '{data["name"]}',
                ROW({data['marks']["final"]}, {data['marks']["midterm"]}, {data['marks']["quizzes"]}, {data['marks']["assignmnets"]} , {data['marks']["project"]} , {data['marks']["practical"]}) ,
                '{data["major"]}', {data["doctor_id_fk"]})
        """))
        db.session.commit()
    
    print(results)
    print(payload)
    return "ok" , 200

@app.route("/doctors/create" , methods = ['post'])
def doctors_create():
    payload = request.get_json()['Data']
    data = payload

    results = db.session.execute(text(f"""
                            INSERT INTO Doctors (gender , first_name	,last_name	,age,	email_address,	phone_number	,degree,	salary	) 
                            VALUES ('{data["gender"]}', '{data["first_name"]}', '{data["last_name"]}', {data["age"]},'{data["email_address"]}', '{data["phone_number"]}',  '{data["degree"]}' , {data["salary"]})
                        """))
    db.session.commit()
    
    print(results)
    print(payload)
    return "ok" , 200

@app.route("/students/create" , methods = ['post'])
def students_create():
    payload = request.get_json()['Data']
    data = payload

    results = db.session.execute(text(f"""
                            INSERT INTO Students (gender , first_name	,last_name	,age,	email_address,	phone_number , level	,cgpa,	total_credit_hours	) 
                            VALUES ('{data["gender"]}', '{data["first_name"]}', '{data["last_name"]}', 
                            {data["age"]},'{data["email_address"]}', '{data["phone_number"]}', 
                            '{data["level"]}' , '{data["cgpa"]}' , {data["total_credit_hours"]})
                        """))
    db.session.commit()
    
    print(results)
    print(payload)
    return "ok" , 200

@app.route("/grades/create" , methods = ['post'])
def grades_create():
    payload = request.get_json()['Data']
    data = payload

    data["total"] = int(data['marks']["final"]) + int(data['marks']["midterm"]) + int(data['marks']["quizzes"]) + int(data['marks']["assignmnets"]) + int(data['marks']["project"]) + int(data['marks']["practical"])
    results = db.session.execute(text(f"""
                            INSERT INTO Grades (student_id_fk ,	subject_id_fk,grade, total) 
                            VALUES ({data['student_id_fk']} , '{data["subject_id_fk"]}',
                               ROW({data['marks']["final"]}, {data['marks']["midterm"]}, {data['marks']["quizzes"]}, {data['marks']["assignmnets"]} , {data['marks']["project"]} , {data['marks']["practical"]}), {data["total"]} )
                        """))
    db.session.commit()
    
    print(results)
    print(payload)
    return "ok" , 200

@app.route("/queries/<int:query_id>" , methods = ['GET'])
def get_query_1(query_id):
    if(query_id == 1):
        results = db.session.execute(text("""
            SELECT S.name, S.semester, min(G.total), max(G.total), avg(G.total), stddev(G.total)
            FROM subjects as S, grades as G
            WHERE S.subject_id = G.subject_id_fk
            group by (S.name, S.semester) 
            ORDER BY avg DESC

        """))
      

    elif(query_id == 2):
        results = db.session.execute(text("""
            SELECT S.major, min(G.total), max(G.total), avg(G.total), stddev(G.total)
            FROM subjects as S, grades as G
            WHERE S.subject_id = G.subject_id_fk
            group by (S.major) 
            ORDER BY avg DESC

        """))
    elif(query_id == 3):
         results = db.session.execute(text("""
            SELECT D.doctor_id, D.first_name, D.last_name, min(G.total), max(G.total), avg(G.total), stddev(G.total)
            FROM doctors as D, grades as G, subjects as S
            WHERE D.doctor_id = S.doctor_id_fk AND G.subject_id_fk = S.subject_id
            GROUP BY (D.doctor_id, D.first_name, D.last_name)
            ORDER BY avg DESC
        """))


    values = [dict(i._mapping) for i in results]
    return {'results' : values}

if( __name__ == '__main__'):
    app.run(debug=True)

# with app.app_context():
#     results = db.session.query(Doctors).from_statement(text("select * FROM  Doctors where age > 50"))
#     for i in results:
#         print(i.subjects)
