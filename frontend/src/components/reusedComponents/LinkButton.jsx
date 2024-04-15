import React from 'react'
import { Link } from 'react-router-dom'

const LinkButton = ({ path, btnColor, btntxt }) => {
    return (
        <Link to={path} className={"btn btn-" + btnColor}>{btntxt}</Link>
    )
}

export default LinkButton