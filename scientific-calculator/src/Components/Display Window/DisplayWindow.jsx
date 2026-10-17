import React from 'react'

const DisplayWindow = ({expression,result}) => {
  return (
    <div className='display-window'>
      <p className='expression'> {expression}
      </p>
      <p className="result">{result}</p>
    </div>
  )
}

export default DisplayWindow
