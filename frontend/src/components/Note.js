import React, { useState } from "react"
import axios from "./Axios"
import passwordEyeOff from "../images/password-eye-off.png"
import passwordEyeOn from "../images/password-eye-on.png"
import { useNavigate, useOutletContext } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const toastStyle = {
position: "top-center",
autoClose: 3000,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: false,
draggable: true,
progress: undefined,
theme: "light",
}

const toastNoteNull = () => toast.warn("Note cannot be null!", toastStyle)
const toastPassword = () => toast.warn("Note password must be at least 8 characters long!", toastStyle)
const toastGeneralError = () => toast.error("There was a problem, please try again later!", toastStyle)

const Note = () => {
   
    const updatePublicNotes = useOutletContext()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        noteHash: undefined,
        noteTitle: "Untitled",
        noteData: "",
        notePublicity: "Public",
        notePassword: ""
    })
    const [enablePassword, setEnablePassword] = useState(false)
    const [passwordEye, setPasswordEye] = useState(false)
    const [titleFocus, setTitleFocus] = useState(false)
    
    const passwordStyle = {
        enabled: {
            backgroundColor: "#FFFFFF",
            color: "#000000",
            cursor: "auto",
            opacity: "1",
        },
        disabled: {
            backgroundColor: "#f2f2f2",
            color: "#999999",
            cursor: "not-allowed",
            opacity: "0.6",
        },
        eyeStyle: {
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            width: "15px",
            height: "15px",
            cursor: "pointer",
        }
    }

    const noteSubmitHandler = (e) => {
        e.preventDefault()
        if (formData.noteData.length > 0 ) { 
            if (enablePassword && formData.notePassword.length < 8) {
                console.log("Note password must be at least 8 characters long")
                toastPassword()
                return
            }
                axios.get("/api/generate-hash", { withCredentials: true })
                .then(response => {
                    const randomHash = response.data;
                    const updatedFormData = { ...formData, noteHash: randomHash }
                    axios.post("/api/create-note", updatedFormData, { withCredentials: true })
                    .then(response => {
                        const { isDataSaved } = response.data
                        if (isDataSaved) {
                            if (formData.notePublicity === "Public"){
                                updatePublicNotes({ noteHash: randomHash, noteTitle: formData.noteTitle })
                            }
                            console.log("Data is saved to the DB")
                        } else {
                            console.log("Data is not saved to the DB due to an Error")
                            toastGeneralError()
                    }
                    setFormData({
                        noteHash: undefined,
                        noteTitle: "Untitled",
                        noteData: "",
                        notePublicity: "Public",
                        notePassword: ""
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
                        console.error("An error occurred:", err)
                        toastGeneralError()
                    })
                })    
                .catch(err => {
                console.error(Error, err)
                })
        } else {
            console.log("Note cannot be null")
            toastNoteNull()
        }
    }

    const handleRemoveText = () => {
        if (!titleFocus) {
        setTitleFocus(true)
        setFormData((prevFormData) => ({
            ...prevFormData,
            noteTitle: "",
            }))
        }    
    }

    const handleInputChange = (e) => {
        const { name, value, type } = e.target
        if (type === "select-one") {
            if (value === "Private") {
                setEnablePassword(true)
                genRanPass()
            }
            if (value === "Public") {
                setEnablePassword(false)
                setPasswordEye(false)
                setFormData((prevFormData)=> ({
                    ...prevFormData, 
                    notePassword: "",
                    notePublicity: "Public" })
                )
            }
        }
        
        const newValue = value;
            setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue,
            }))
        }
    
    const genRanPass = () => {
        axios.get("/api/generate-pass")
         .then(response => {
        const randomPass = response.data
        setFormData((prevFormData) => ( {
            ...prevFormData, 
            notePassword: randomPass
            })
        )
        })
         .catch(err => {
            console.error(Error, err)
            toastGeneralError()
        })
    }

    const togglePasswordInput = (e) => {
        const { type, checked } = e.target
        if (type === "checkbox"){
            if (checked) {
                setEnablePassword(true)
                setFormData((prevFormData)=> ({
                    ...prevFormData, 
                    notePublicity: "Private" })
                )
                genRanPass()
            } else {
                setEnablePassword(false)
                setPasswordEye(false)
                setFormData((prevFormData)=> ({
                    ...prevFormData, 
                    notePassword: "",
                    notePublicity: "Public" })
                )
            } 
        }
    }
    
    const togglePasswordEye = () => {
        setPasswordEye((prevPasswordEye)=>!prevPasswordEye)    
    }

    return(
        <>
        <ToastContainer />
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
                        maxLength={30}
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
                         {enablePassword ? "Enabled" : "Disabled"}
                    </label>
                </div>
                <div className="form-setting-input">
                    <div className="password-input-wrapper">
                        <input 
                            type={passwordEye ? "password" : "text"} 
                            name="notePassword"
                            id="notePassword"
                            className="password-input" 
                            value={formData.notePassword}
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
                        className="note-publicity"
                        onChange={handleInputChange}
                    >
                        <option 
                            value="Public">
                            Public
                        </option>
                        <option 
                            value="Private">
                            Private
                        </option>
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