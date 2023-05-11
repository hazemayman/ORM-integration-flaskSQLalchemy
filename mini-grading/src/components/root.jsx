import React  , {useState , useEffect} from 'react'
import axios from 'axios';
import './root.css';
import GridLoader from "react-spinners/GridLoader";

export default function Root() {

    const [errorMessage , setErrorMessage] = useState('')
    const [queryData , setQueryData] = useState([])
    const [queryId , setQueryId] = useState(0)
    const [loading , setLoading] = useState(false);

    const handleQueryClick = (query_id) =>{
        setQueryId(query_id)
        setQueryData([])
        setLoading(true)
        axios.get('/queries/'+query_id , {

        }).then(function(response){
            if(response.status == 200){
                console.log(response.data.results)
                setQueryData(response.data.results)
                setErrorMessage("")
                setLoading(false)
            }else{
                setErrorMessage("There was an error in executing query "+ query_id)
                setLoading(false)

            }
        })
        .catch(function(error){
            setErrorMessage(error.message)
            setLoading(false)

        });
    }
    let viewElements = ""
    if(queryData.length != 0){
        if(queryId == 1){
            viewElements = queryData.map((element,index) =>{
                return (
                    <>
                        <dev className = "subject-card">
                            <h5>{element.name}</h5>
                            <h5>{element.semester}</h5>
                            <h5>{element.min}</h5>
                            <h5>{element.max}</h5>
                            <h5>{element.avg}</h5>
                            <h5>{element.stddev}</h5>
                        </dev>
                        <hr></hr>
                    </>
                    // <p className=''>{index+1}</p>
                )
            }) 

            viewElements = <>
                <dev className="current-subjects-container">
                        <dev className = "subject-card subject-card-unique">
                                        <h5>Subject</h5>
                                        <h5>Semester</h5>
                                        <h5>Min</h5>
                                        <h5>Max</h5>
                                        <h5>Mean</h5>
                                        <h5>Standard deviation</h5>
                        </dev>
                        {viewElements}
                </dev>
            </>
        }
        else if (queryId == 2){
            viewElements = queryData.map((element,index) =>{
                return (
                    <>
                        <dev className = "subject-card">
                            <h5>{element.major}</h5>
                            <h5>{element.min}</h5>
                            <h5>{element.max}</h5>
                            <h5>{element.avg}</h5>
                            <h5>{element.stddev}</h5>
                        </dev>
                        <hr></hr>
                    </>
                    // <p className=''>{index+1}</p>
                )
            }) 

            viewElements = <>
                <dev className="current-subjects-container">
                        <dev className = "subject-card subject-card-unique">
                                        <h5>Major</h5>
                                        <h5>Min</h5>
                                        <h5>Max</h5>
                                        <h5>Mean</h5>
                                        <h5>Standard deviation</h5>
                        </dev>
                        {viewElements}
                </dev>
            </>
        }
        else if (queryId == 3){
            viewElements = queryData.map((element,index) =>{
                return (
                    <>
                        <dev className = "subject-card">
                            <h5>{element.first_name}</h5>
                            <h5>{element.last_name}</h5>
                            <h5>{element.min}</h5>
                            <h5>{element.max}</h5>
                            <h5>{element.avg}</h5>
                            <h5>{element.stddev}</h5>
                        </dev>
                        <hr></hr>
                    </>
                    // <p className=''>{index+1}</p>
                )
            }) 

            viewElements = <>
                <dev className="current-subjects-container">
                        <dev className = "subject-card subject-card-unique">
                                        <h5>Doctor's first name</h5>
                                        <h5>Doctor's last name</h5>
                                        <h5>Min</h5>
                                        <h5>Max</h5>
                                        <h5>Mean</h5>
                                        <h5>Standard deviation</h5>
                        </dev>
                        {viewElements}
                </dev>
            </>
        }
    }
    console.log(queryData)
    return (
        <>
            <div className='root-container'>
                {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                
                <div className='relation-pages-container'>
                    <a href={'/subjects'}> Subjects </a>
                    <a href={'/doctors'}> Doctors </a>
                    <a href={'/students'}> Students </a>
                    <a href={'/grades'}> Grades </a>
                </div>

                <div className='queries-container'>
                    <a onClick={(even) => handleQueryClick(1)}> Query 1 </a>
                    <a onClick={(even) => handleQueryClick(2)}> Query 2 </a>
                    <a onClick={(even) => handleQueryClick(3)}> Query 3 </a>
                
                </div>



                <GridLoader color='#1915e5c1' loading={loading} size={15} />
                {viewElements}

             
            </div>
        </>
    )
}