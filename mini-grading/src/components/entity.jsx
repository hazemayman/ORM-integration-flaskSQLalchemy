import React  , {useState , useEffect} from 'react'
import axios from 'axios';
import './subjects.css';
import {
    useParams,
  } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import {browserHistory} from 'react-router'

export default function Entity(props){

    const [entity , setEntity] = useState(false)
    const id = useParams()['id'];
    const navigate = useNavigate();

    console.log(entity)
    const get_entity = () =>{
        axios.get('/'+props.entity_type+'/'+id , {

        }).then(function(response){
            if(response.status == 200){
                setEntity(response.data.result[0])
                console.log(response.data.result[0])
            }else{
                alert("entity probably not found 404")
            }
        })
        .catch(function(error){
            alert(error.message)
        });
    }
    useEffect(()=>{
        console.log("here")
        get_entity()        
    } , [id, props.entity_type])

    const cardClicked = (id) =>{
        setEntity(false)
        if(props.entity_type == 'doctors'){
            navigate("/subjects/"+id, { replace: true })
        }else if (props.entity_type == 'subjects'){
            navigate("/students/"+id, { replace: true })
        }else if (props.entity_type == 'students'){
            navigate("/subjects/"+id, { replace: true })
        }else if (props.entity_type == 'grades'){

        }
    }
    let viewElements = <></>

    if(entity != false){
        if(props.entity_type == 'subjects'){
            viewElements = 
            <>
    
                <dev className='subjects-container'>
    
                    <dev className='new-subject-form'>
    
                        <label>Semester
                            <p>{entity.semester}</p>
                        </label>
                        <label>Subject Major
                            <p>{entity.major}</p>
                        </label>
                        <label>Subejct Name
                            <p>{entity.name}</p>
    
                        </label>
                        <label>Credit Hours
                            <p>{entity.credit_hours}</p>
    
                        </label>
                        <label>Doctor Teaching
                            <p>{entity.doctor.first_name} {entity.doctor.last_name}</p>
    
                        </label>
                        <label id='marks-dist-label'>Marks distribution 
                            <div className='marks-dist-container'>
                                <label>Final 
                                    <p>{entity.marks.final}</p>
                                </label>
                                <label>Midterm 
                                    <p>{entity.marks.midterm}</p>
                                </label>
                                <label>Qsuizzes 
                                    <p>{entity.marks.quizzes}</p>
                                </label>
                                <label>Assignmnets
                                    <p>{entity.marks.assignmnets}</p> 
                                </label>
                                <label>Project 
                                    <p>{entity.marks.project}</p>
                                </label>
                                <label>Practical 
                                    <p>{entity.marks.practical}</p>
                                </label>
                            </div> 
                        </label>
                    </dev>
         
                    <dev className="current-subjects-container">
                    <dev className = "subject-card subject-card-unique">
                                    <h5>First name</h5>
                                    <h5>Last name</h5>
                                    <h5>Level</h5>
                                    <h5>total</h5>
                                    <h5>cgpa</h5>
                    </dev>
                    {entity.students.map((element,index) =>{
                        return (
                            <>
                                <dev className = "subject-card"  onClick = {(event) => cardClicked(element.student_id)}>
                                    <h5>{element.first_name}</h5>
                                    <h5>{element.last_name}</h5>
                                    <h5>{element.level}</h5>
                                    <h5>{element.total}</h5>
                                    <h5>{element.cgpa}</h5>
                                    
                                </dev>
                                <hr></hr>
                            </>
                            // <p className=''>{index+1}</p>
                        )
                    }) }
                    </dev> 
    
                </dev>
            </>
        }else if (props.entity_type == "doctors"){
            viewElements = 
            <>
                <dev className='subjects-container'>
    
                    <dev className='new-subject-form'>
    
                    <label>First name
                        <p>{entity.first_name}</p>
                    </label>
                    <label>Last name
                        <p>{entity.last_name}</p>
                    </label>
                    <label>Age
                        <p>{entity.age}</p>
                    </label>
                    <label>Email address
                        <p>{entity.email_address}</p>
                    </label>
                    <label>Phone number
                       <p>{entity.phone_number}</p>
                    </label>
                    <label>Gender
                        <p>{entity.gender}</p>
                    </label>
                    <label>Degree
                        <p>{entity.degree}</p>
                    </label>
                    <label>Salary
                        <p>{entity.salary}</p>
                    </label>
                    </dev>
         
                    <dev className="current-subjects-container">
                    {/* subject_id	semester	name	marks	major	credit_hours	doctor_id_fk	 */}
                    <dev className = "subject-card subject-card-unique">
                                    <h5>Semester</h5>
                                    <h5>Subject name</h5>
                                    <h5>Major</h5>
                                    <h5>Credit hours</h5>
                                    <h5>F,M,Q,A,P,P</h5>
                    </dev>
                    {entity.subjects.map((element,index) =>{
                        return (
                            <>
                                <dev className = "subject-card"  onClick = {(event) => cardClicked(element.subject_id)}>
                                    <h5>{element.semester}</h5>
                                    <h5>{element.name}</h5>
                                    <h5>{element.major}</h5>
                                    <h5>{element.credit_hours}</h5>
                                    <h5>{element.marks.final} , {element.marks.midterm} , {element.marks.quizzes} , {element.marks.assignmnets}, {element.marks.project} , {element.marks.practical}</h5>
                                    
                                </dev>
                                <hr></hr>
                            </>
                            // <p className=''>{index+1}</p>
                        )
                    }) }
                    </dev> 
    
                </dev>
            </>
        }else if(props.entity_type == 'students'){
            viewElements = 
            <>
                <dev className='subjects-container'>
    
                    <dev className='new-subject-form'>
    
                    <label>First name
                        <p>{entity.first_name}</p>
                    </label>
                    <label>Last name
                        <p>{entity.last_name}</p>
                    </label>
                    <label>Age
                        <p>{entity.age}</p>
                    </label>
                    <label>Email address
                        <p>{entity.email_address}</p>
                    </label>
                    <label>Phone number
                       <p>{entity.phone_number}</p>
                    </label>
                    <label>Gender
                        <p>{entity.gender}</p>
                    </label>
                    <label>Level
                        <p>{entity.level}</p>
                    </label>
                    <label>CGPA
                        <p>{entity.cgpa}</p>
                    </label>
                    <label>Total credit hours taken
                        <p>{entity.total_credit_hours}</p>
                    </label>
                    </dev>
         
                    <dev className="current-subjects-container">
                    {/* subject_id	semester	name	marks	major	credit_hours	doctor_id_fk	 */}
                    <dev className = "subject-card subject-card-unique">
                                    <h5>Semester</h5>
                                    <h5>Subject name</h5>
                                    <h5>Major</h5>
                                    <h5>Credit hours</h5>
                                    <h5>F,M,Q,A,P,P</h5>
                    </dev>
                    {entity.subjects.map((element,index) =>{
                        return (
                            <>
                                <dev className = "subject-card"  onClick = {(event) => cardClicked(element.subject_id)}>
                                    <h5>{element.semester}</h5>
                                    <h5>{element.name}</h5>
                                    <h5>{element.major}</h5>
                                    <h5>{element.credit_hours}</h5>
                                    <h5>{element.grades.final} , {element.grades.midterm} , {element.grades.quizzes} , {element.grades.assignmnets}, {element.grades.project} , {element.grades.practical}</h5>
                                   
                                </dev>
                                <hr></hr>
                            </>
                            // <p className=''>{index+1}</p>
                        )
                    }) }
                    </dev> 
    
                </dev>
            </>
        }else if(props.entity_type == "grades"){

            // 'subject_id' : self.subject_id_fk,
            // 'student_id' : self.student_id_fk,
            // 'grade_id' : self.grade_id,
            // 'marks' : get_marks(self.grade),
            // 'total' : self.total,
            // 'student_name' : f'{self.student.first_name} {self.student.last_name}',
            // 'subject_name' : f'{self.subject.name}',
            // 'student' : {
            //     'student_id' : self.student.student_id,
            //     'first_name' : self.student.first_name,
            //     'last_name' : self.student.last_name,
            //     'age' : self.student.age,
            //     'email_address' : self.student.email_address,
            //     'phone_number' : self.student.phone_number,
            //     'gender' : self.student.gender,
            //     'level' : self.student.level,
            //     'cgpa' : self.student.cgpa,
            //     'total_credit_hours' : self.student.total_credit_hours,
            // },
            // 'subject' : {
            //     'subject_id' : self.subject.subject_id,
            //     'semester' : self.subject.semester,
            //     'name' : self.subject.name,
            //     'marks' : get_marks(self.subject.marks),
            //     'major' : self.subject.major,
            //     'credit_hours' : self.subject.credit_hours,
            // },
            // 'doctor' : {
            //     'first_name' : self.subject.doctors.first_name,
            //     'last_name' : self.subject.doctors.last_name,
            //     'age' : self.subject.doctors.age,
            //     'email_address' : self.subject.doctors.email_address,
            //     'phone_number' : self.subject.doctors.phone_number,
            // }
            console.log("qweasdasdqw" + entity.subject.marks.final)
            viewElements = 
            <>
                <dev className='subjects-container'>
                    <dev className='new-subject-form'>
                    <label>Subject
                        <p>{entity.subject.name}</p>
                    </label>
                    <label>Major
                        <p>{entity.subject.major}</p>
                    </label>
                    <label>Subject credit hours
                        <p>{entity.subject.credit_hours}</p>
                    </label>
                    <label id='marks-dist-label'>Marks distribution 
                        <div className='marks-dist-container'>
                            <label>Final 
                                <p>{entity.subject.marks.final}</p>
                            </label>
                            <label>Midterm
                                <p>{entity.subject.marks.midterm}</p>
                            </label>
                            <label>Qsuizzes   
                                <p>{entity.subject.marks.quizzes}</p>
                            </label>
                            <label>Assignmnets 
                                <p>{entity.subject.marks.assignmnets}</p>
                            </label>
                            <label>Project 
                                <p>{entity.subject.marks.project}</p>
                            </label>
                            <label>Practical 
                                <p>{entity.subject.marks.practical}</p>
                            </label>
                        </div> 
                    </label>

                    <label id='marks-dist-label'> Grades 
                        <div className='marks-dist-container'>
                            <label>Final 
                                <p>{entity.marks.final}</p>
                            </label>
                            <label>Midterm
                                <p>{entity.marks.midterm}</p>
                            </label>
                            <label>Qsuizzes   
                                <p>{entity.marks.quizzes}</p>
                            </label>
                            <label>Assignmnets 
                                <p>{entity.marks.assignmnets}</p>
                            </label>
                            <label>Project 
                                <p>{entity.marks.project}</p>
                            </label>
                            <label>Practical 
                                <p>{entity.marks.practical}</p>
                            </label>
                        </div> 
                    </label>
                    <label>total
                        <p>{entity.total}</p>
                    </label>
                    <label>Student name
                        <p>{entity.student.first_name} {entity.student.last_name}</p>
                    </label>
                    <label>Student email
                        <p>{entity.student.email_address}</p>
                    </label>
                    <label>CGPA
                        <p>{entity.student.cgpa}</p>
                    </label>
                    <label>Student credit hours taken
                        <p>{entity.student.total_credit_hours}</p>
                    </label>
                    <label>Student level
                        <p>{entity.student.level}</p>
                    </label>
                    <label>Doctor name
                        <p>{entity.doctor.first_name} {entity.doctor.last_name}</p>
                    </label>
                    <label>Doctor email
                        <p>{entity.doctor.email_address}</p>
                    </label>
                    <label>Doctor degree
                        <p>{entity.doctor.degree}</p>
                    </label>
                    <label>Phone number
                       <p>{entity.doctor.phone_number}</p>
                    </label>
                    <label>Salary
                        <p>{entity.doctor.salary}</p>
                    </label>
                    </dev>
                </dev>
            </>
        }
        
    }

    
    console.log(props)
    return(
        <>
            {viewElements}
        </>
    )
}