import React from 'react'
import axios from './Axios'
import {useEffect, useState, useRef, useCallback} from 'react'
import {useParams} from 'react-router-dom'
import Password from './Password'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import trashcanImg from '../images/trash-can.png'

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

const toastTitleSaved = () => toast.success("Title saved!", toastStyle)
const toastNoteSaved = () => toast.success("Note saved!", toastStyle)
const toastCopiedClipboard = () => toast.info("Copied to Clipboard!", toastStyle)
const toastGeneralError = () => toast.error("There was a problem, please try again later!", toastStyle)
const toastNoteDeleted = () => toast.success("Note successfully deleted!", toastStyle) 

const NoteView = () => {
    const {id} = useParams('')
    const [note, setNote] = useState({})
    const [noteNotFound, setNoteNotFound] = useState(false)
    const [formattedDate, setFormattedDate] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isNotePrivate, setIsNotePrivate] = useState(false)
    const [noteData, setNoteData] = useState('')
    const [copiedData, setCopiedData] = useState({
        copiedId : false,
        copiedPath : false
    })
    const [copyDisabled, setCopyDisabled] = useState({
        disabledId : false,
        disabledPath : false
    })
    const [isNoteAuth, setIsNoteAuth] = useState(false)
    const idRef = useRef(null)
    const pathRef = useRef(null)
    const inputTitleRef = useRef(null)
    const currentPath = window.location.href
    const [isNoteModified, setIsNoteModified] = useState(false)
    const [isTitleModified, setIsTitleModified] = useState(false)
    const [isNoteSaved, setIsNoteSaved] = useState(false)
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [noteTitle, setNoteTitle] = useState('')
    const [isTitleSaved, setIsTitleSaved] = useState(false)
    const [isTitleEditable, setIsTitleEditable] = useState(true)
    const [isNoteDeleted, setIsNoteDeleted] = useState(false)

    useEffect(()=> {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`/api/retrieve-note/${id}`, { withCredentials: true })
                const notePublicity = response.data.notePublicity
                setNoteData(response.data.noteData)
                if (notePublicity === 'Private') {
                    setIsNotePrivate(true)
                }
                else {
                    setIsNotePrivate(false)
                }
                setNoteNotFound(false)
                setNote(response.data)
                setNoteTitle(response.data.noteTitle)
            } catch(err) {
                console.error('Error', err)
                setNoteNotFound(true)
            }
        }

        const checkSession = async () => {
          try {
            const response = await axios.get('/api/check-session', { withCredentials: true })
            if (response.data.loggedIn 
                && 
                response.data.authenticatedHash === id) {
                setIsNoteAuth(true)
            }
          } catch (err) {
            console.error('Error', err)
          }
        }

        setLoading(true)
        Promise.all([fetchNote(), checkSession()]).finally(() => {
        setLoading(false)
        })
      }, [id])
      
    useEffect(()=> {
        const changeDateFormat = () => {
            if (note) {
                const options = {
                    weekday: 'short',
                    day: '2-digit',     
                    month: 'short',    
                    year: 'numeric',    
                    hour: 'numeric',     
                    minute: '2-digit',     
                    hour12: false 
                }
                const formattedDate = new Date(note.createdAt).toLocaleString('en-US', options)
                setFormattedDate(formattedDate)
            }
        }
        changeDateFormat()
    }, [note])

    const saveNote = useCallback(async(noteData) => {
        if (isNotePrivate && isNoteModified){
            const updatedNote = {
                noteHash: id,
                updatedNote: noteData
            }
            try {
                const response = await axios.put('/api/update-note', updatedNote, { withCredentials: true })
                const {result} = response.data
                if (response.status === 200) {
                    if (result) {
                        setIsNoteSaved(true)
                        console.log('Note is saved to the DB')
                        toastNoteSaved()
                        } else {
                        console.log('Note is not saved to the DB due to an Error')
                        toastGeneralError()
                    }
                } 
            }
            catch (err) {
                console.error('Error', err)
                toastGeneralError()
            } finally {
                setTimeout(()=>{
                    setIsNoteSaved(false)
                    setIsNoteModified(false)
                },2000) 
            } 
        }
    }, [id, isNoteModified, isNotePrivate])

    const saveTitle = useCallback(async(newTitle) => {
        if (isNotePrivate && isTitleModified){
                const updatedTitle = {
                    noteHash: id,
                    updatedTitle: newTitle
                }
                try {
                    setIsTitleEditable(false)
                    const response = await axios.put('/api/update-title', updatedTitle, { withCredentials: true })
                    const {result} = response.data
                    if (response.status === 200) {
                        if (result) {
                            setIsTitleSaved(true)
                            console.log('Title is saved to the DB')
                            toastTitleSaved()
                            } else {
                            console.log('Title is not saved to the DB due to an Error')
                            toastGeneralError()
                        } 
                    }
                }
                catch (err) {
                    console.error('Error', err)
                    toastGeneralError()
                } finally {
                   setTimeout(()=>{
                        setIsTitleEditable(true)
                        setIsTitleModified(false)
                        setIsTitleSaved(false)
                    },2000) 
                }
        }
    }, [id, isTitleModified, isNotePrivate])

    useEffect(() => {
        let saveNoteTimeout = null
        if (isNoteModified && !isNoteSaved) {
          saveNoteTimeout = setTimeout(() => {
            saveNote(noteData)
          }, 3000)
        }
    
        return () => {
          clearTimeout(saveNoteTimeout)
        }
      }, [saveNote, noteData, isNoteModified, isNoteSaved])
      
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!isNoteSaved && isNoteModified) {
                e.preventDefault()
                saveNote(noteData)
            }
            if (!isTitleSaved && isTitleModified) {
                e.preventDefault()
                saveTitle(noteTitle) 
            }
          } 

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [saveNote, saveTitle, isNoteModified, isTitleModified, isNoteSaved, isTitleSaved, noteTitle, noteData])

    const handleNoteAuth = () => {
        setIsNoteAuth(true)
    }

    if (loading) {
        return <div>Loading...</div>
      }

    if (noteNotFound) {
        return <div className="no-note-found">
                    Note cannot be found
                </div>
      }

    if (isNoteDeleted) {
        return (
        <>
        <ToastContainer />
            <div className="note-deleted">
                Note deleted         
            </div>
        </>
        )
    }

    const copyText = (el) => {
        var copiedEl
        var disabledEl
        var ref
    
        if ((el === 'note-id' && copyDisabled.disabledId) ||
            (el === 'note-path' && copyDisabled.disabledPath))  
            {
            return
            }

            if (el === 'note-id') {
                ref = idRef 
                copiedEl =  () => setCopiedData((prevCopiedData)=> ({
                        ...prevCopiedData, 
                        copiedId : !prevCopiedData.copiedId
                        })
                )
                disabledEl = () => setCopyDisabled((prevIsCopyDisabled)=> ({
                        ...prevIsCopyDisabled, 
                        disabledId : !prevIsCopyDisabled.disabledId
                        })
                )
            } else if (el === 'note-path') {
                ref = pathRef
                copiedEl =  () => setCopiedData((prevCopiedData)=> ({
                        ...prevCopiedData, 
                        copiedPath : !prevCopiedData.copiedPath
                        })
                )
                disabledEl = () => setCopyDisabled((prevIsCopyDisabled)=> ({
                        ...prevIsCopyDisabled, 
                        disabledPath : !prevIsCopyDisabled.disabledPath
                        })
                )
            }
                console.log('Text copied to clipboard')
                toastCopiedClipboard()
                ref.current.select()
                navigator.clipboard.writeText(ref.current.value)
                copiedEl()
                disabledEl()
                setTimeout(()=> {
                    copiedEl()
                    disabledEl()
                } ,2000)
    }

    const updateNote = (e) => {
        const newNote = e.target.value
        setNoteData(newNote) 
        setIsNoteModified(true)
        setIsNoteSaved(false)
    }
    
    const handleTitleClick = () => {
        if (!isEditingTitle) {
            setIsEditingTitle(true)
            setTimeout(() => {
            if (inputTitleRef.current) {
              inputTitleRef.current.focus()
            }
          }, 0)
        }
    }

    const handleTitleChange = (e) => {
        const newTitle = e.target.value
        setIsTitleModified(true)
        setIsTitleSaved(false)
        setNoteTitle(newTitle)
    }

    const handleTitleBlur = async(e) => {
        const newTitle = e.target.value
        setIsEditingTitle(false)
        await saveTitle(newTitle)
    }
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur()
        }
    }

    const deleteNote = async(e) => {
        const confirmed = window.confirm('Are you sure you want to delete this note?')
        if (confirmed) {
            try {
                const response = await axios.delete(`/api/delete-note/${id}`, { withCredentials: true })
                if (response.status === 200){
                    console.log('Note successfully deleted') 
                    toastNoteDeleted()  
                    setIsNoteDeleted(true)
                }
            } catch (err) {
                if (err.response.status === 400) {
                    console.log('There was an issue deleting your note', err)  
                    toastGeneralError() 
                }
                if (err.response.status === 500) {
                    console.log('Internal server error')
                    toastGeneralError()
                }
            }
        }
    }
    
    return(
        <>
        <ToastContainer />
        { 
            note.notePublicity === 'Private' 
            && 
            !isNoteAuth 
            && 
            <Password 
            id={id} 
            onNoteAuth={handleNoteAuth}
            /> 
        }
        { 
            (note.notePublicity !== 'Private' 
            || 
            ( note.notePublicity === 'Private' 
            && 
            isNoteAuth ))
            && 
            (<>
            <div className="title-save">
                <span 
                    htmlFor="title-save">{isTitleSaved? 'Title Saved' : '' }
                </span>
            </div>
            {isEditingTitle && isNotePrivate ? 
                
            <input 
                type="text" 
                value={noteTitle}
                className='edit-title-input'
                id='edit-title-input'
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleKeyDown}
                disabled={!isTitleEditable}
                maxLength={30}
                ref={inputTitleRef}
            />
            :
            <span 
                className="note-title" 
                onClick={handleTitleClick}>
                {noteTitle}
            </span>
            }
           
            <span>{formattedDate} - <span 
                className={
                    note.notePublicity === 'Private' ? 
                    'publicity-span-private' : 
                    'publicity-span-public'
                }>
                {
                note.notePublicity === 'Private' ? 
                    'Private (password protected)' : 
                    'Public (viewed by everyone)'
                }
                {
                note.notePublicity === 'Private' ? 
                    <img 
                        src={trashcanImg} 
                        onClick={deleteNote}
                        className="trashcan-image" 
                        alt="trashcan delete note icon" /> :
                    ''
                }
                </span>  
                </span>
             
            <form className="form-note">
                <div className="note-save">
                    <span htmlFor="note-save">
                        {
                        isNoteSaved? 'Note Saved' : 
                        ''
                        }
                    </span>
                </div>
                    <div className="form-note-wrapper">
                        <textarea 
                            className="form-note-textarea" 
                            name="noteData"
                            rows="15" 
                            maxLength="2000"
                            value={noteData}
                            readOnly={isNotePrivate? false : true}
                            onChange={isNotePrivate? updateNote : null}
                        />
                    </div>
                    <div className="note-info-wrapper">
                            <label htmlFor="note-id">Note ID:</label>
                            <input 
                                    type="text" 
                                    name="note-id"
                                    id="note-id"
                                    className="note-id"
                                    ref={idRef}
                                    value={note.noteHash} 
                                    onClick={(el) => (copyText(el.target.name))}
                                    readOnly                           
                            />
                            <label 
                                htmlFor="note-id">
                                {
                                copiedData.copiedId ? 
                                'Copied to clipboard' : 
                                ''
                                }
                            </label>
                    </div>
                
                    <div className="note-info-wrapper">
                            <label 
                                htmlFor="note-path">
                                Note Path:
                                </label>
                            <input 
                                    type="text" 
                                    name="note-path"
                                    id="note-path"
                                    className="note-path"
                                    ref={pathRef}
                                    value={`${currentPath}`} 
                                    onClick={(el) => (copyText(el.target.name))}
                                    readOnly                        
                            />
                            <label 
                                htmlFor="note-path">
                                {
                                copiedData.copiedPath ? 
                                'Copied to clipboard' : 
                                ''
                                }
                            </label>
                    </div>
            </form>
            </>)
        }
        </>
    )
}
export default NoteView