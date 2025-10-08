import React from 'react'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function Starwars() {
    const [starwars, setStarwars] = useState([]);
    useEffect(() => {
        async function fetchStarwars() {
            let response = await  fetch('https://swapi.py4e.com/api/people/');
            let datos = await response.json();
            setStarwars(datos.results);
        }
        fetchStarwars();
    })

    console.log(starwars);
    function dataordenada(){
        const infoordenada= Starwars.map((info)=>{
            return(
                <><h1>
                    {info.name}
                </h1><ul>
                        <li>{info.age}</li>
                        <li>{info.hair}</li>
                    </ul><hr></hr></>
            )
            return(dataordenada)
        }
    )
    }

  return (
    <div>
        <h1>{starwars[0].name}</h1>
    </div>
  )
}
