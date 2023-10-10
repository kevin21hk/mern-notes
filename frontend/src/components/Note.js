import axios from './Axios'
import React, {useState} from 'react';
import passwordEyeOff from '../images/password-eye-off.png'
import passwordEyeOn from '../images/password-eye-on.png'

const Note = () => {

    const [formData, setFormData] = useState({
        noteTitle: 'Untitled',
        noteData: '',
        notePublicity: 'Public',
        notePassword: undefined
    })

    const [enablePassword, setEnablePassword] = useState(false)
    const [passwordEye, setPasswordEye] = useState(false)
    const [titleFocus, setTitleFocus] = useState(false)

    const passwordStyle = {
        enabled : {
            backgroundColor : "#FFFFFF",
            color : "#000000",
            cursor : "auto",
            opacity : "1",
        },
        disabled : {
            backgroundColor : "#f2f2f2",
            color : "#999999",
            cursor : "not-allowed",
            opacity : "0.6",
        },
        eyeStyle : {
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            width: '15px',
            height: '15px',
            cursor: 'pointer',
        }
    }
    
    const noteSubmitHandler = (e) => {
        e.preventDefault()
        
        axios.post('/api/create-note', formData)

        setFormData({
            noteTitle: 'Untitled',
            noteData: '',
            notePublicity: 'Public',
            notePassword: ''
        })
        setEnablePassword(false)
    }

    const handleRemoveText = (e) => {
        if (!titleFocus) {
        setTitleFocus(true)
        setFormData((prevFormData) => ({
            ...prevFormData,
            noteTitle: '',
            }))
        }    
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newValue = value;
            setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
            }))
        }
    
    const genRanPass = () => {
        axios.get('/api/generate-pass')
         .then(response => {
        const randomPass = response.data;
        setFormData((prevFormData) => ( {
            ...prevFormData, notePassword : randomPass
            })
        )
        })
         .catch(error => {

        });
    }

    const togglePasswordInput = (e) => {
        const { type, checked } = e.target;
        if (type === 'checkbox'){
            if (checked) {
                setEnablePassword(true)
                genRanPass()
            } else {
                setEnablePassword(false)
                setPasswordEye(true)
                setFormData((prevFormData)=> ({
                    ...prevFormData, notePassword: ''})
                )
            } 
        }
    }
    
    const togglePasswordEye = (e) => {
        setPasswordEye((prevPasswordEye)=>!prevPasswordEye)    
    }

    return(
        <>
        <form className="form-note" onSubmit={noteSubmitHandler}>
            <div className="form-note-wrapper">
                <textarea 
                    className="form-note-textarea" 
                    name="noteData"
                    rows="15" 
                    maxLength="2000"
                    value={formData.noteData}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-setting-wrapper">
                <div className="form-setting-input">
                    <label htmlFor="title">Title:</label>
                    <input 
                        type="textbox" 
                        className="title" 
                        name="noteTitle"
                        value={formData.noteTitle}
                        onFocus={handleRemoveText}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-setting-input">
                    <label htmlFor="enable-password">Password?:</label>
                    <input 
                        name="enablePassword"
                        type="checkbox" 
                        className="enable-password"
                        checked={enablePassword}
                        onChange={togglePasswordInput} 
                    />
                    <label 
                        htmlFor="notePassword" 
                        className="enable-password-info" 
                    >
                         {enablePassword ? 'Enabled' : 'Disabled'}
                    </label>
                </div>
                <div className="form-setting-input">
                    <div className="password-input-wrapper">
                        <input 
                            type={passwordEye ? "password" : "text"} 
                            name="notePassword"
                            className="password-input" 
                            value={formData.notePassword}
                            onChange={handleInputChange}
                            style={enablePassword ? passwordStyle.enabled : passwordStyle.disabled}
                            disabled={!enablePassword}
                        />
                        { enablePassword && ( 
                            <img
                                src={passwordEye ? passwordEyeOff : passwordEyeOn}
                                alt="Password Eye"
                                className="password-icon"
                                onClick={togglePasswordEye}
                                style={passwordStyle.eyeStyle}
                            />
                        )}
                    </div>
                </div>
                <div className="form-setting-input">
                    <label htmlFor="Publicity">Publicity:</label>
                    <select
                        name="notePublicity"
                        value={formData.notePublicity}
                        onChange={handleInputChange}
                    >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>
                </div>
                <div className="form-note-btn">
                    <input type="submit" value="Create Note"/>
                </div>
            </div>
        </form>
        </>
    )  
}
export default Note