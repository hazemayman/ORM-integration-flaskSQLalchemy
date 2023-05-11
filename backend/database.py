import psycopg2
import random
import datetime

DATABASE_NAME = "mini_grading_sys"
DATABASE_USER = 'postgres'
DATABASE_PASSWORD = "postgres"
DATABASE_HOST = 'localhost'

DOCTORS_NUM = 30
STUDENTS_NUM = 100
SUBJECTS_NUM = 30
MIN_STUDENT_GRADE_NUM = 10
MAX_STUDENT_GRADE_NUM = 15 

tables = [
    "Person",
    "Doctors",
    'Students',
    'Subjects',
    'Grades'
]

def establish_connection():
    conn = None

    try:
        print(f'\nConnecting to the {DATABASE_NAME} database')
        conn = psycopg2.connect(
        host = DATABASE_HOST,
        database = DATABASE_NAME,
        user = DATABASE_USER,
        password = DATABASE_PASSWORD)

        cur = conn.cursor()

        print(f'\n{DATABASE_NAME} database version (postgresql vetsion) :')
        cur.execute('SELECT version()')

        db_version = cur.fetchone()
        print(db_version)

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print("\nthere was an error in connection : " , error)

    finally:
        if conn is not None:
            print("\nconnection established successfully\n")
            return conn
        else:
            print("\nthere was an error return NONE object")
            return None

def createTables(conn : psycopg2.connect):


    commands = (
        """
        CREATE TABLE Person (
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            age SMALLINT NOT NULL,
            email_address VARCHAR(100) NOT NULL,
            phone_number VARCHAR(20) NOT NULL,
            gender VARCHAR(50) NOT NULL
        )

        """,
        """ 
        CREATE TABLE Doctors (
                doctor_id SERIAL PRIMARY KEY,
                degree  VARCHAR(100),
                salary INT NOT NULL
        ) INHERITS (Person)

        """,
        """
        CREATE TABLE Students (
                student_id SERIAL PRIMARY KEY,
                level VARCHAR(100) NOT NULL,
                CGPA float(2) DEFAULT 0.00,
                total_credit_hours SMALLINT DEFAULT 0
        )INHERITS (Person)

        """,
        """
        CREATE TYPE marks_dist AS (
                final SMALLINT ,
                midterm SMALLINT ,
                quizzes SMALLINT ,
                assignmnets SMALLINT ,
                project SMALLINT ,
                practical SMALLINT
        )

        
        """
        ,
        """
        CREATE TABLE Subjects (
                subject_id SERIAL UNIQUE NOT NULL,
                semester date NOT NULL DEFAULT CURRENT_DATE,
                name VARCHAR(100) NOT NULL,
                PRIMARY KEY (name , semester),
                marks marks_dist,
                major VARCHAR(100) NOT NULL,
                credit_hours INT NOT NULL,
                doctor_id_fk INT,
                FOREIGN KEY (doctor_id_fk)
                    REFERENCES Doctors (doctor_id)
                    ON UPDATE CASCADE ON DELETE CASCADE
        )   

        """,
        """
        CREATE TABLE Grades (
                student_id_fk INT NOT NULL,
                subject_id_fk  INT NOT NULL,
                grade_id SERIAL UNIQUE NOT NULL,
                grade marks_dist,
                total INT,
                PRIMARY KEY (student_id_fk, subject_id_fk),
                FOREIGN KEY (subject_id_fk) 
                    REFERENCES Subjects (subject_id)
                    ON UPDATE CASCADE ON DELETE CASCADE,
                FOREIGN KEY (student_id_fk) 
                    REFERENCES Students (student_id)
                    ON UPDATE CASCADE ON DELETE CASCADE
        )
        """)
    
    if conn is not None:

        try :
            cur = conn.cursor()

            for command in commands:
                cur.execute(command)

            cur.close()

            conn.commit()

            for table in tables:
                print(f"table {table} was successfully created")

        except (Exception, psycopg2.DatabaseError) as error:
            cur.close()
            conn.commit()
            print("\nthere was an error in connection : " , error)
    
    else:
        print("The connection object isn't properly defined, plesae create connection object to the database")

def deleteTables(conn : psycopg2.connect):
    commands = (

        """
        DROP TABLE Grades 
        """,
        """
        DROP TABLE Subjects 
        """,
        """
        DROP TABLE  Students
        """,
        """
        DROP TABLE  Doctors
        """,
        """
        DROP TABLE Person
        """,
        """
        DROP TYPE marks_dist
        """
    )

    if conn is not None:
        try :
            cur = conn.cursor()
            
            for command in commands:
                cur.execute(command)
            
            cur.close()

            conn.commit()

        except (Exception, psycopg2.DatabaseError) as error:
            cur.close()
            conn.commit()
            print("\nthere was an error in connection : " , error)
    else:
        print("The connection object isn't properly defined, plesae create connection object to the database")

male_names = [
    'Ahmed',
    'Mohamed',
    'Mostafa',
    'Gamal',
    'Hazem',
    'Ismail',
    'Hany',
    'Bahaa',
    'Ayman',
    'Yossef',
    'Omar',
    'Lotfy',
    'Adel',
    'Hosny',
    'Amir',
    'Hossam',
    'Magdy',
    'Amr',
    'Alaa',
    'Shady',
    'Kareem',
    'Yehya',
    'Nader',
    'Akram'
]

female_names = [
    'Sara',
    'Mariam',
    'Nada',
    'Rania',
    'Amira',
    'Nour',
    'Nouran',
    'Raghad',
    'Hala',
    'Maram',
    'Mayar',
    'Aber',
    'Shahd',
    'Yassmin',
    'Farah',
    'Alia',
    'Nermin',
    'Haidy',
    'Radwa',
]

marks = [
    'final',
    'quizzes',
    'assignmnets',
    'midterm',
    'practical',
    'project'
]

marks_dist = [
    {
        'final' : 40,
        'quizzes' : 10,
        'assignmnets' : 10,
        'midterm' : 20,
        'practical' : 5,
        'project' : 15
    },
    {
        'final' : 60,
        'quizzes' : 5,
        'assignmnets' : 5,
        'midterm' : 20,
        'practical' : 0,
        'project' : 10
    },
    {
        'final' : 40,
        'quizzes' : 10,
        'assignmnets' : 0,
        'midterm' : 25,
        'practical' : 5,
        'project' : 20
    },
    {
        'final' : 40,
        'quizzes' : 10,
        'assignmnets' : 0,
        'midterm' : 20,
        'practical' : 0,
        'project' : 30
    },
    {
        'final' : 60,
        'quizzes' : 10,
        'assignmnets' : 5,
        'midterm' : 20,
        'practical' : 5,
        'project' : 0
    },
    {
        'final' : 60,
        'quizzes' : 10,
        'assignmnets' : 0,
        'midterm' : 20,
        'practical' : 10,
        'project' : 0
    },
    {
        'final' : 0,
        'quizzes' : 10,
        'assignmnets' : 10,
        'midterm' : 0,
        'practical' : 0,
        'project' : 80
    },
]

majors = [
    'Computer Engineering',
    'Electrical engineering',
    'Civil Engineering',
    'Mechatronics Engineering',
    'Mechanical Engineering',
    'Material Engineering',
    'Communication Engineering'
]

level = [
    'Freshmen',
    'Sophomore',
    'Junior',
    'Senior 1',
    'Senior 2'
]

degree = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
]

subjects = [
    'Computer Network',
    'Operating System',
    'Computer Architecture',
    'High Performance Computing'
    'Database Design',
    'Computer Programming',
    'Design Patterns',
    'Analysis and Design of Algorithms',
    'Power Engineering',
    'Communications System',
    'Power Electronics',
    'Control System',
    'Digital signal processing',
    'Structural Engineering',
    'Fluid Mechanics',
    'Geotechnical Engineering',
    'Engineering Drawing',
    'Electronic Design',
    'Design and Manufacturing',
    'Biomaterials'
]

years = [
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023'
]

def fill_doctos(conn):
    for x in range(DOCTORS_NUM):
        gender = random.randint(0,1)
        data = {}
        if(gender == 0) : # male
            firstname = male_names[random.randint(0, len(male_names)-1)]
            data['gender'] = 'Male'

        else:
            firstname = female_names[random.randint(0, len(female_names)-1)]
            data['gender'] = 'Female'
        

        number = ''

        for j in range(8):
            number += str(random.randint(0,9))
        data['first_name'] = firstname
        last_name = male_names[random.randint(0, len(male_names)-1)]

        data['last_name'] = last_name
        data['age'] = random.randint(30, 80)    
        data['email_address'] = f'{firstname}_{last_name}@gmail.com'
        data['phone_number'] = f'010{number}'
        # data['major'] = majors[random.randint(0, len(majors)-1)]
        data['degree'] = degree[random.randint(0, len(degree)-1)]
        data['salary'] = random.randint(10000, 30000)

        if conn is not None:

                try :
                    cur = conn.cursor()

                    
                    cur.execute(f"""
                            INSERT INTO Doctors (gender , first_name	,last_name	,age,	email_address,	phone_number	,degree,	salary	) 
                            VALUES ('{data["gender"]}', '{data["first_name"]}', '{data["last_name"]}', {data["age"]},'{data["email_address"]}', '{data["phone_number"]}',  '{data["degree"]}' , {data["salary"]})
                        """)

                    cur.close()

                    conn.commit()
                except (Exception, psycopg2.DatabaseError) as error:
                    cur.close()
                    conn.commit()
                    print("\nthere was an error in connection : " , error)
                
        else:
            print("The connection object isn't properly defined, plesae create connection object to the database")
        
def fill_sudents(conn):
    #  level	cgpa	total_credit_hours	
    for x in range(STUDENTS_NUM):
        gender = random.randint(0,1)
        data = {}
        if(gender == 0) : # male
            firstname = male_names[random.randint(0, len(male_names)-1)]
            data['gender'] = 'Male'

        else:
            firstname = female_names[random.randint(0, len(female_names)-1)]
            data['gender'] = 'Female'
        

        number = ''

        for j in range(8):
            number += str(random.randint(0,9))
        data['first_name'] = firstname
        last_name = male_names[random.randint(0, len(male_names)-1)]

        data['last_name'] = last_name
        data['age'] = random.randint(20, 27)    
        data['email_address'] = f'{firstname}_{last_name}@gmail.com'
        data['phone_number'] = f'010{number}'
        data['level'] = level[random.randint(0, len(level)-1)]
        data['cgpa'] = round(random.uniform(1,4),  2)
        data['total_credit_hours'] = random.randint(10, 130)

        if conn is not None:

                try :
                    cur = conn.cursor()

                    
                    cur.execute(f"""
                            INSERT INTO Students (gender , first_name	,last_name	,age,	email_address,	phone_number , level	,cgpa,	total_credit_hours	) 
                            VALUES ('{data["gender"]}', '{data["first_name"]}', '{data["last_name"]}', 
                            {data["age"]},'{data["email_address"]}', '{data["phone_number"]}', 
                            '{data["level"]}' , '{data["cgpa"]}' , {data["total_credit_hours"]})
                        """)

                    cur.close()

                    conn.commit()
                except (Exception, psycopg2.DatabaseError) as error:
                    cur.close()
                    conn.commit()
                    print("\nthere was an error in connection : " , error)
                
        else:
            print("The connection object isn't properly defined, plesae create connection object to the database")

unique_rows = []
def fill_subjects(conn):
    # 	semester	name	marks	major	doctor_id	
    #   final SMALLINT ,
    #   midterm SMALLINT ,
    #   quizzes SMALLINT ,
    #   assignmnets SMALLINT ,
    #   project SMALLINT ,
    #   practical SMALLINT

    filled = {}
    for x in range(min(SUBJECTS_NUM , len(years) * len(subjects))):
        data = {}
        semester =  datetime.datetime(int(years[random.randint(0 , len(years) - 1)]) , 10 , 1)
        name = subjects[random.randint(0 , len(subjects) - 1)]

        while(semester in filled and name in filled[semester]):
            semester =  datetime.datetime(int(years[random.randint(0 , len(years) - 1)]) , 10 , 1)
            name = subjects[random.randint(0 , len(subjects) - 1)]
        
        if(semester in filled):
            filled[semester].append(name)
        else:
            filled[semester] = [name]
        data['semester'] = semester
        data['name'] = name
        data['major'] = majors[random.randint(0, len(majors)-1)]
        data['doctor_id'] = random.randint(1, DOCTORS_NUM)
        data['marks'] = marks_dist[random.randint(0, len(marks_dist)-1)]
        data['credit_hours'] = random.randint(2,3)
        unique_rows.append([name , data['semester'], data['marks'], x + 1])

        if conn is not None:

                try :
                    cur = conn.cursor()

                    
                    cur.execute(f"""
                            INSERT INTO Subjects (credit_hours, semester,	name	,marks,	major	,doctor_id_fk	) 
                            VALUES ({data['credit_hours']} , '{data["semester"]}', '{data["name"]}',
                               ROW({data['marks']["final"]}, {data['marks']["midterm"]}, {data['marks']["quizzes"]}, {data['marks']["assignmnets"]} , {data['marks']["project"]} , {data['marks']["practical"]}) ,
                              '{data["major"]}', {data["doctor_id"]})
                        """)

                    cur.close()

                    conn.commit()
                except (Exception, psycopg2.DatabaseError) as error:
                    cur.close()
                    conn.commit()
                    print("\nthere was an error in connection : " , error)
                
        else:
            print("The connection object isn't properly defined, plesae create connection object to the database")

def fill_grades(conn):
    # student_id	subject_id	semester	grade	total
    for x in range(STUDENTS_NUM):
        taken_subjects_list = []
        num_subjects_taken = random.randint(MIN_STUDENT_GRADE_NUM , MAX_STUDENT_GRADE_NUM)
        for j in range(num_subjects_taken):
            data = {}
            index = random.randint(0 , len(unique_rows) - 1)
            while(index in taken_subjects_list):
                index = random.randint(0 , len(unique_rows) - 1)
            taken_subjects_list.append(index)
            subject_taken = unique_rows[index]

            data['student_id'] = x + 1
            data['subject_id'] = subject_taken[-1]
            data['semester'] = subject_taken[1]
            data['grade'] = {}
            
            total = 0
            for i in range(len(marks)):
                data['grade'][marks[i]] = random.randint( int(subject_taken[2][marks[i]]*0.6) , subject_taken[2][marks[i]])
                total +=data['grade'][marks[i]]

            data['total'] = total   
            if conn is not None:

                try :
                    cur = conn.cursor()

                    
                    cur.execute(f"""
                            INSERT INTO Grades (student_id_fk ,	subject_id_fk,grade, total) 
                            VALUES ({data['student_id']} , '{data["subject_id"]}',
                               ROW({data['grade']["final"]}, {data['grade']["midterm"]}, {data['grade']["quizzes"]}, {data['grade']["assignmnets"]} , {data['grade']["project"]} , {data['grade']["practical"]}), {data["total"]} )
                        """)

                    cur.close()

                    conn.commit()
                except (Exception, psycopg2.DatabaseError) as error:
                    cur.close()
                    conn.commit()
                    print("\nthere was an error in connection : " , error)
                
            else:
                print("The connection object isn't properly defined, plesae create connection object to the database")
                
def fill_database(conn):
    fill_doctos(conn=conn)
    fill_sudents(conn=conn)
    fill_subjects(conn=conn)
    fill_grades(conn=conn)

conn = establish_connection()

deleteTables(conn=conn)
createTables(conn=conn)
fill_database(conn=conn)
