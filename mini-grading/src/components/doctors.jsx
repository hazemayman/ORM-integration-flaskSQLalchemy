import React  , {useState , useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './subjects.css';
import GridLoader from "react-spinners/GridLoader";

// let first_time = true
export default function Doctors(){

    const [inputs, setInputs] = useState({});
    const [errorMessage , setErrorMessage] = useState('')
    const [all_doctors, setAll_doctors] = useState([])
    const [loading , setLoading] = useState(true);

    const navigate = useNavigate();

    const handleChange = (event) => {
        console.log(event.target.value)
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))

    }

    const cardClicked = (id)=>{
        navigate("/doctors/"+id, { replace: true })
    }

    const update_doctors = () =>{
        axios.get('/doctors' , {

        }).then(function(response){
            if(response.status == 200){
                console.log(response.data.result)
                setAll_doctors(response.data.result)
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
        
        axios.post('/doctors/create', {
            'Data': inputs,
            })
            .then(function (response) {
                if(response.status === 200){
                    setInputs(old => (
                        {'marks' : {}}
                    ))  
                    update_doctors()
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
            update_doctors()

    } , [])

    console.log(all_doctors)
    return(
        <>
            <dev className='subjects-container'>
            {/* first_name	last_name	age	email_address	phone_number	gender	doctor_id	degree	salary	 */}
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
                            onChange={handleChange}
                            value={inputs.age || ""} 
                            autocomplete="off"
                        />
                    </label>
                    <label>Email address
                        <input 
                            type="email" 
                            name="email_address" 
                            onChange={handleChange}
                            value={inputs.email_address || ""} 
                            autocomplete="off"
                        />
                    </label>
                    <label>Phone number
                        <input 
                            type="phone" 
                            name="phone_number" 
                            onChange={handleChange}
                            value={inputs.phone_number || ""} 
                            autocomplete="off"
                        />
                    </label>
                    <label>Gender
                        <input 
                            type="gender" 
                            name="gender" 
                            onChange={handleChange}
                            value={inputs.gender || ""} 
                            autocomplete="off"
                        />
                    </label>
                    <label>Degree
                        <input 
                            type="text" 
                            name="degree" 
                            onChange={handleChange}
                            value={inputs.degree || ""} 
                            autocomplete="off"
                        />
                    </label>
                    <label>Salary
                        <input 
                            type="number" 
                            name="salary" 
                            onChange={handleChange}
                            value={inputs.salary || ""} 
                            autocomplete="off"
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
                                    <h5>Degree</h5>
                                    <h5>Salar</h5>                                
                                </dev>

                    
                    {all_doctors.map((element,index) =>{
                        return (
                            <>
                                <dev className = "subject-card"  onClick = {(event) => cardClicked(element.doctor_id)}>
                                    <h5>{element.first_name}</h5>
                                    <h5>{element.last_name}</h5>
                                    <h5>{element.age}</h5>
                                    <h5>{element.email_address}</h5>
                                    <h5>{element.phone_number}</h5>
                                    <h5>{element.gender}</h5>
                                    <h5>{element.degree}</h5>
                                    <h5>{element.salary}</h5>                                
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