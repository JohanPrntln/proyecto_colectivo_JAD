import React from 'react'
import { useParams } from 'react-router-dom'

export default function Ejemplo_Parametro() {
    let parametros = useParams();
  return (
    <div>
        <h1>{parametros.id}</h1>
        <h2>{parametros.nombre}</h2>
    </div>
  )
}
