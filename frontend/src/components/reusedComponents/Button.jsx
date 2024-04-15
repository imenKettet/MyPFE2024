import React from 'react'

const Button = ({ btntxt, type, handleSubmit, btnColor }) => {
    return (
        <button type={type} className={`d-block mx-auto btn btn-${btnColor}`} onClick={handleSubmit}>{btntxt}</button>
    )
}

export default Button