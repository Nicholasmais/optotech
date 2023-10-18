import React from 'react'
import MatrixLetter from '../../components/MatrixLetter'

const index = () => {
  return (
    <div>
      <MatrixLetter letter={[[1,1,1,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,1],[1,1,1,1,1]]} fontSize={5}></MatrixLetter>
    </div>
  )
}

export default index