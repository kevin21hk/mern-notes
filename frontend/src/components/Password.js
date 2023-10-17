import React, {useState} from 'react'
import passwordEyeOff from '../images/password-eye-off.png'
import passwordEyeOn from '../images/password-eye-on.png'

const Password = () => {

    const [passwordEye, setPasswordEye] = useState(true)

    const togglePasswordEye = (e) => {
        setPasswordEye((prevPasswordEye)=>!prevPasswordEye)    
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
                <input type="submit" value="Submit"/>
            </div>
        </form>
        </>
    )
}
export default Password