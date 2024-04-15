import React from 'react'
import ButtonPage from './LinkButton';

const PageContainer = ({ children, title, path, btnColor, btntxt }) => {
    return (
        <div className="container-fluid card">
            <div className="card-header d-flex justify-content-between">
                <div></div>
                <h4>
                    <b>{title}</b>
                </h4>
                {path ? <ButtonPage path={path} btnColor={btnColor} btntxt={btntxt} /> : <div></div>}
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    )
}

export default PageContainer