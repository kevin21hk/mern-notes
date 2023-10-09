const Note = () => {

const noteSubmitHandler = (e) => {
    e.preventDefault()
}

const togglePasswordInput = () => {
    const enablePassword = document.querySelector('.enable-password')
    const passwordInput = document.querySelector('.password-input')
    const enablePasswordInfo = document.querySelector('.enable-password-info')

    if (enablePassword.checked) {
        passwordInput.disabled = false
        enablePasswordInfo.textContent = "Enabled"
        passwordInput.style.backgroundColor = "#FFFFFF"
        passwordInput.style.color = "#000000"
        passwordInput.style.cursor = "auto"
        passwordInput.style.opacity = "1"
    } else {
        passwordInput.disabled = true;
        enablePasswordInfo.textContent = "Disabled"
        passwordInput.value = ""
        passwordInput.style.backgroundColor = "#f2f2f2"
        passwordInput.style.color = "#999999"
        passwordInput.style.cursor = "not-allowed"
        passwordInput.style.opacity = "0.6"
    }
}

    return(
        <>
        <form className="form-note" onSubmit={noteSubmitHandler}>
            <div className="form-note-wrapper">
                <textarea className="form-note-textarea" rows="15" maxLength="2000"/>
            </div>
            <div className="form-setting-wrapper">
                <div className="form-setting-input">
                    <label htmlFor="title">Title:</label>
                    <input type="textbox" className="title" name="title" />
                </div>
                <div className="form-setting-input">
                    <label htmlFor="enable-password">Password?:</label>
                    <input type="checkbox" className="enable-password" onChange={togglePasswordInput} />
                    <label htmlFor="password-input" className="enable-password-info">Disabled</label>
                </div>
                <div className="form-setting-input">
                    <input type="password" className="password-input" disabled/>
                </div>
                <div className="form-setting-input">
                    <label htmlFor="Publicity">Publicity:</label>
                    <select>
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