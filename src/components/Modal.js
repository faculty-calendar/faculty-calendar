import React from 'react'

function Modal() {
    return (
        <div className='modalBackground'>
            <div className='modalContainer'>
                <button>X</button>
                <div classname="title">
                    <h1>Are you sure you want to delete the Event??</h1>
                </div>
                <div classname="body">
                    <p>The selected event will be deleted</p>
                </div>
                <div classname="footer">
                    <button>Cancel</button>
                    <button>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Modal