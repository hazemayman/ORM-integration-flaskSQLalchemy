import React  , {useState , useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './subjects.css';
import GridLoader from "react-spinners/GridLoader";



// let first_time = true
export default function Subjects(){

    const [inputs, setInputs] = useState({'marks' : {}});
    const [errorMessage , setErrorMessage] = useState('')
    const [all_subjects, setAll_subjects] = useState([])
    const [loading , setLoading] = useState(true);

    const navigate = useNavigate();

    const handleChange = (event) => {
        console.log(event.target.value)
        const name = event.target.name;
        const value = event.target.value;
        if(['final' , 'midterm','quizzes','assignmnets','project','practical'].includes(name)){
            setInputs(values => ({...values, 'marks' : {...values.marks, [name] : value}}))

            
        }else{
            setInputs(values => ({...values, [name]: value}))

        }

    }

    const cardClicked = (id)=>{
        navigate("/subjects/"+id,{ replace: true })
    }

    const update_subjects = () =>{
        axios.get('/subjects' , {

        }).then(function(response){
            if(response.status == 200){
                console.log(response.data.result)
                setAll_subjects(response.data.result)
            }else{
                setErrorMessage("There was an error loading subjects")
            }
            setLoading(false)

        })
        .catch(function(error){
            setErrorMessage(error.message)
            setLoading(false)

        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if( parseInt(inputs.marks.final)+ 
            parseInt(inputs.marks.midterm) +
            parseInt(inputs.marks.quizzes)+
            parseInt(inputs.marks.assignmnets) +
            parseInt(inputs.marks.project) +
            parseInt(inputs.marks.practical)  != 100
            
            ){
                console.log("here")
                setErrorMessage("ERROR : marks distibution should sum to 100")
                return
            }
        
        axios.post('/subjects/create', {
            'Data': inputs,
            })
            .then(function (response) {
                if(response.status === 200){
                    setInputs(old => (
                        {'marks' : {}}
                    ))  
                    update_subjects()
                    setErrorMessage('')
                }else{
                setErrorMessage("There is something wrong, with server, or with your input data")
                }

            })
            .catch(function (error) {
                setErrorMessage(error.message)
            });
        
    }


    useEffect(()=>{
            update_subjects()

    } , [])

    console.log(all_subjects)
    return(
        // subject_id	integer		auto increment	yes	no	Edit Delete
        // semester	date		CURRENT_DATE	yes	no	Edit Delete
        // name	varchar(100)	100			no	Edit Delete
        // marks	marks_dist				yes	Edit Delete
        // major	varchar(100)	100			no	Edit Delete
        // credit_hours	integer				no	Edit Delete
        // doctor_id_fk	integer				yes	Edit Delete

        // midterm SMALLINT ,
        // quizzes SMALLINT ,
        // assignmnets SMALLINT ,
        // project SMALLINT ,
        // practical SMALLINT
        <>
            <dev className='subjects-container'>

                <form onSubmit={handleSubmit} className='new-subject-form'>
                    {errorMessage && <p className="errorMessage">{errorMessage}</p>}

                    <label>Semester
                        <input 
                            type="date" 
                            name="semester" 
                            onChange={handleChange}
                            value={inputs.semester || ""} 
                            autocomplete="off"
                        />
                    </label>
                    <label>Subject Major
                        <input 
                            type="text" 
                            name="major" 
                            onChange={handleChange}
                            value={inputs.major || ""} 
                            autocomplete="off"
                        />
                    </label>
                    <label>Subejct Name
                        <input 
                            type="text" 
                            name="name" 
                            value={inputs.name || ""} 
                            onChange={handleChange}
                        />
                    </label>
                    <label>Credit Hours
                        <input 
                            type="number" 
                            name="credit_hours" 
                            value={inputs.credit_hours || ""} 
                            onChange={handleChange}
                        />
                    </label>
                    <label>Doctor Teaching
                        <input 
                            type="number" 
                            name="doctor_id_fk" 
                            value={inputs.doctor_id_fk || ""} 
                            onChange={handleChange}
                        />
                    </label>
                    <label id='marks-dist-label'>Marks distribution 
                        <div className='marks-dist-container'>
                            <label>Final 
                                <input 
                                    type="number" 
                                    name="final" 
                                    value={inputs.marks.final || ""} 
                                    onChange={handleChange}
                                />
                            </label>
                            <label>Midterm 
                                <input 
                                    type="number" 
                                    name="midterm" 
                                    value={inputs.marks.midterm  || ""} 
                                    onChange={handleChange}
                                />
                            
                            </label>
                            <label>Qsuizzes 
                                <input 
                                    type="number" 
                                    name="quizzes" 
                                    value={inputs.marks.quizzes || ""} 
                                    onChange={handleChange}
                                />
                            
                            </label>
                            <label>Assignmnets 
                                <input 
                                    type="number" 
                                    name="assignmnets" 
                                    value={inputs.marks.assignmnets || ""} 
                                    onChange={handleChange}
                                />
                            
                            </label>
                            <label>Project 
                                <input 
                                    type="number" 
                                    name="project" 
                                    value={inputs.marks.project || ""} 
                                    onChange={handleChange}
                                />
                            
                            </label>
                            <label>Practical 
                                <input 
                                    type="number" 
                                    name="practical" 
                                    value={inputs.marks.practical || ""} 
                                    onChange={handleChange}
                                />
                            
                            </label>
                        </div> 
                    </label>

                    <input className='submit-form' type="submit" />
                </form>


                <GridLoader color='#1915e5c1' loading={loading} size={15} />
                {!loading &&     
                    <dev className="current-subjects-container">
                    <dev className = "subject-card subject-card-unique">
                                    <h5>Subject name</h5>
                                    <h5>Credit hours</h5>
                                    <h5>Majour</h5>
                                    <h5>Semester</h5>
                                    <h5>Doctor teaching</h5>
                                    <h5>F,M,Q,A,P,P</h5>
                                    
                    </dev>


                    {all_subjects.map((element,index) =>{
                        return (
                            <>
                                <dev className = "subject-card"  onClick = {(event) => cardClicked(element.subject_id)}>
                                    <h5>{element.name}</h5>
                                    <h5>{element.credit_hours}</h5>
                                    <h5>{element.major}</h5>
                                    <h5>{element.semester}</h5>
                                    <h5>{element.doctor.first_name} {element.doctor.last_name}</h5>
                                    <h5>{element.marks.final} ,{element.marks.midterm} ,{element.marks.quizzes} ,{element.marks.assignmnets} ,{element.marks.project} ,{element.marks.practical} </h5>
                                    
                                </dev>
                                <hr></hr>
                            </>
                            // <p className=''>{index+1}</p>
                        )
                    }) }
                    </dev>
                }
            </dev>

        </>
    )
}