import React from 'react'
import { Link } from 'react-router-dom'

const PageContainer = ({ children, title, path, btnColor, btntxt }) => {
    return (
        <div className="container-fluid card">
            <div className="card-header d-flex justify-content-between">
                <h4>{title}</h4>
                {path !== '/listProjects' && <Link to={path} className={"btn btn-" + btnColor}> {btntxt}</Link>}
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    )
}

export default PageContainer