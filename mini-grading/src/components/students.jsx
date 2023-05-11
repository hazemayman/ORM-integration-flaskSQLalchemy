import React  , {useState , useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './subjects.css';
import GridLoader from "react-spinners/GridLoader";


// let first_time = true
export default function Students(){

    const [inputs, setInputs] = useState({});
    const [errorMessage , setErrorMessage] = useState('')
    const [all_students, setall_students] = useState([])
    const [loading , setLoading] = useState(true);

    const navigate = useNavigate();

    const handleChange = (event) => {
        console.log(event.target.value)
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const cardClicked = (id)=>{
        navigate("/students/"+id, { replace: true })
    }

    const update_subjects = () =>{
        axios.get('/students' , {

        }).then(function(response){
            if(response.status == 200){
                console.log(response.data.result)
                setall_students(response.data.result)
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
        axios.post('/students/create', {
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
                
            console.log(error)
            ;
        });
        
    }


    useEffect(()=>{
            update_subjects()

    } , [])

    console.log(all_students)
    return(
// first_name	last_name	age	email_address	phone_number	gender	student_id	level	cgpa	total_credit_hours	

        <>
            <dev className='subjects-container'>

                <form onSubmit={handleSubmit} className='new-subject-form'>
                    {errorMessage && <p className="errorMessage">{errorMessage}</p>}

                    <label>First name
                        <input 
                            type="text" 
                            name="first_name" 
                            onChange={handleChange}
                            value={inputs.first_name || ""} 
                            autocomplete="off"
                        />
                    </label>
                    <label>Last name
                        <input 
                            type="text" 
                            name="last_name" 
                            onChange={handleChange}
                            value={inputs.last_name || ""} 
                            autocomplete="off"
                        />
                    </label>
                    <label>Age
                        <input 
                            type="number" 
                            name="age" 
                            value={inputs.age || ""} 
                            onChange={handleChange}
                        />
                    </label>
                    <label>Email address
                        <input 
                            type="email" 
                            name="email_address" 
                            value={inputs.email_address || ""} 
                            onChange={handleChange}
                        />
                    </label>
                    <label>Phone number
                        <input 
                            type="phone" 
                            name="phone_number" 
                            value={inputs.phone_number || ""} 
                            onChange={handleChange}
                        />
                    </label>
                    <label>Gender
                        <input 
                            type="text" 
                            name="gender" 
                            value={inputs.gender || ""} 
                            onChange={handleChange}
                        />
                    </label> 
                    <label>Level
                        <input 
                            type="text" 
                            name="level" 
                            value={inputs.level || ""} 
                            onChange={handleChange}
                        />
                    </label> 
                    <label>CGPA
                        <input 
                            type="number" 
                            name="cgpa" 
                            value={inputs.cgpa || ""} 
                            onChange={handleChange}
                        />
                    </label>
                    <label>total credit hours
                        <input 
                            type="text" 
                            name="total_credit_hours" 
                            value={inputs.total_credit_hours || ""} 
                            onChange={handleChange}
                        />
                    </label>


                    <input className='submit-form' type="submit" />
                </form>

                <GridLoader color='#1915e5c1' loading={loading} size={15} />

                {!loading && 
                    <dev className="current-subjects-container">

                    <dev className = "subject-card subject-card-unique">
                                    <h5>First name</h5>
                                    <h5>Last name</h5>
                                    <h5>Age</h5>
                                    <h5>Email address</h5>
                                    <h5>Phone number</h5>
                                    <h5>Gender</h5>
                                    <h5>level</h5>
                                    <h5>CGPA</h5>  
                                    <h5>Total credit hours</h5>  
                                    
                    </dev>


                    {all_students.map((element,index) =>{
                        return (
                            <>
                                <dev className = "subject-card"  onClick = {(event) => cardClicked(element.student_id)}>
                                    <h5>{element.first_name}</h5>
                                    <h5>{element.last_name}</h5>
                                    <h5>{element.age}</h5>
                                    <h5>{element.email_address}</h5>
                                    <h5>{element.phone_number} </h5>
                                    <h5>{element.gender} </h5>
                                    <h5>{element.level} </h5>
                                    <h5>{element.cgpa} </h5>
                                    <h5>{element.total_credit_hours} </h5>
                                    
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