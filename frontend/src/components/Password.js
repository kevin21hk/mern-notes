import React, {useState} from 'react'
import passwordEyeOff from '../images/password-eye-off.png'
import passwordEyeOn from '../images/password-eye-on.png'
import axios from './Axios'

const Password = (props) => {

    const [passwordEye, setPasswordEye] = useState(true)
    const [enteredPass, setEnteredPass] = useState('')

    const togglePasswordEye = (e) => {
        setPasswordEye((prevPasswordEye)=>!prevPasswordEye)    
    }

    const authNote = (e) => {
    
        e.preventDefault()
        
        const dataAuth = 
            { 
            enteredPass : enteredPass,
            id : props.id
            }
        axios.post('/api/auth/', dataAuth, { withCredentials: true })
        .then((res)=> {
        const noteIsAuth = res.data
            if (noteIsAuth) {
                props.onNoteAuth()
            }
            else {
            }
        })
        .catch((err) => console.log('Error', err))
        }
        const handleEntPassChange = (e) => {
        const {value} = e.target
        setEnteredPass(value)
        }

    return(
        <>
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