import React, {useState} from 'react'
import passwordEyeOff from '../images/password-eye-off.png'
import passwordEyeOn from '../images/password-eye-on.png'
import axios from './Axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

const Password = (props) => {
    const [passwordEye, setPasswordEye] = useState(true)
    const [enteredPass, setEnteredPass] = useState('')
    const togglePasswordEye = () => {
        setPasswordEye((prevPasswordEye)=>!prevPasswordEye)    
    }

    const authNote = async(e) => {
        e.preventDefault()
        if (enteredPass.length > 0){
            const dataAuth = 
            { 
            enteredPass : enteredPass,
            id : props.id
            }
            try {
                const res = await axios.post('/api/auth/', dataAuth, { withCredentials: true })
                if (res.status === 200) {
                    const {noteIsAuth} = res.data
                    console.log(res.data)
                    if (noteIsAuth) {
                        console.log('test')
                        toast.success(`Successful Authentication`, toastStyle)
                        props.onNoteAuth()
                    }
                }
            } catch (err) {
                let failedLoginAttempts = null
                let remainingTime = null
                    if (err.response.status === 401) {
                        failedLoginAttempts = err.response?.data?.failedLoginAttempts
                        if (failedLoginAttempts < 3) {
                            toast.warn(`Password incorrect. Current attempts: ${failedLoginAttempts}`, toastStyle)
                        }
                        if (failedLoginAttempts === 3) {
                            toast.error("Password incorrect for 3 consecutive tries. Note locked for 5 minutes", toastStyle)
                        }
                    } else
                    if (err.response.status === 423) {
                        if (err.response?.data?.remainingTime) {
                            remainingTime = err.response.data.remainingTime
                        }
                        if (remainingTime > 0) {
                            const totalSeconds = Math.floor(remainingTime / 1000)
                            const minutes = Math.floor((totalSeconds % 3600) / 60)
                            const seconds = totalSeconds % 60
                            if (minutes > 0) {
                                toast.error(`Note is locked due to many failed attempts. 
                                Please try again in ${minutes} minutes, and ${seconds} seconds.`, toastStyle)
                            }
                            else {
                                toast.error(`Note is locked due to many failed attempts. 
                                Please try again in ${seconds} seconds.`, toastStyle)
                            }
                        }
                    } else {
                        console.error('Error', err)
                    }
            }
        } else {
            toast.warning("Password input box cannot be empty", toastStyle)
        }
    }

    const handleEntPassChange = (e) => {
    const {value} = e.target
    setEnteredPass(value)
    }

    return(
        <>
        <ToastContainer />
        <form className="form-password">
            <div className="password-access-label">
                <label htmlFor="password-input-access">You must enter the password to access the note</label>
            </div>
            <div className="password-wrapper">
                <div className="password-label">
                    <label
                    htmlFor="password-input-access" 
                    >Password:</label>
                </div>
            
                <div className="password-input-wrapper">
                    <input 
                        type={passwordEye ? "password" : "text"} 
                        name="passwordAccess"
                        id="password-input-access"
                        className="password-input-access"
                        minLength={8}
                        maxLength={18}
                        value={enteredPass}
                        onChange={handleEntPassChange}
                    />
                        
                    <img
                        src={passwordEye ? passwordEyeOff : passwordEyeOn}
                        alt="Password Eye"
                        className="password-icon"
                        onClick={togglePasswordEye}
                    />
                </div>
            </div>
            <div className="form-password-btn">
                <input type="submit" value="Submit" onClick={authNote}/>
            </div>
        </form>
        </>
    )
}
export default Password