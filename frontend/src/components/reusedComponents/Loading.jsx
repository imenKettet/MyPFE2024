import React from 'react'

const Loading = ({ text }) => {
    return (
        <div>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            <span className='text-white'>{text}</span>
        </div>
    )
}

export default Loading