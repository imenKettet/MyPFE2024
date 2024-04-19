import React from 'react'
import { Link } from 'react-router-dom'

const LinkButton = ({ click, path, btnColor, btntxt }) => {
    if (path) {
        return (
            <Link to={path} className={"btn btn-" + btnColor}>{btntxt}</Link>
        )
    }
    if (click) {
        return (
            <button onClick={click} className={"btn btn-" + btnColor}>{btntxt}</button>
        )
    }

}

export default LinkButton