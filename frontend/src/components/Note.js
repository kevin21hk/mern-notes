import React, {useState} from 'react';
import axios from './Axios'
import passwordEyeOff from '../images/password-eye-off.png'
import passwordEyeOn from '../images/password-eye-on.png'
import {useNavigate} from 'react-router-dom'

const Note = () => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        noteHash: undefined,
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
        e.preventDefault();
        
        if (formData.noteData.length > 0) { 
            axios.get('/api/generate-hash')
            .then(response => {
                const randomHash = response.data;
                const updatedFormData = {...formData, noteHash:randomHash}
                axios.post('/api/create-note', updatedFormData)
                .then(response => {
                    const {isDataSaved} = response.data
                    if (isDataSaved) {
                        console.log('Data is saved to the DB')
                    } else {
                        console.log('Data is not saved to the DB due to an Error')
                }
                setFormData({
                    noteHash: undefined,
                    noteTitle: 'Untitled',
                    noteData: '',
                    notePublicity: 'Public',
                    notePassword: undefined
                })
                setEnablePassword(false)
                setPasswordEye(false)
                setTitleFocus(false)
                const viewNoteUrl = `/view-note/${randomHash}`
                    if (isDataSaved){
                        navigate(viewNoteUrl)
                    }
                }
                )
                .catch((err) => {
                    console.error('An error occurred:', err)
                })
            })    
            .catch(err => {
            console.error(Error, err)
            });
        } else {
            console.log('Note cannot be null')
        }
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
                setPasswordEye(false)
                setFormData((prevFormData)=> ({
                    ...prevFormData, 
                    notePassword: undefined})
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
                        id="title"
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
                        id="enable-password"
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
                            id="notePassword"
                            className="password-input" 
                            value={enablePassword ? formData.notePassword : ''}
                            maxLength={18}
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
                    <label htmlFor="publicity">Publicity:</label>
                    <select
                        name="notePublicity"
                        id="publicity"
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