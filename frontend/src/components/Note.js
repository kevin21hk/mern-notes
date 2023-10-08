const Note = () => {

const noteSubmitHandler = (e) => {
e.preventDefault()
}

    return(
        <>
        <form className="form-note" onSubmit={noteSubmitHandler}>
            <div className="form-note-wrapper">
                <textarea className="form-note-textarea" rows="15" maxLength="2000"/>
            </div>
            <input type="submit" />
        </form>
        </>
    )  
}
export default Note