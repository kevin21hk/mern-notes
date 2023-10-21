import React from 'react'
import axios from './Axios'
import {useEffect, useState, useRef} from 'react'
import {useParams} from 'react-router-dom'
import Password from './Password'

const NoteView = () => {
    const {id} = useParams('')
    const [note, setNote] = useState({})
    const [noteNotFound, setNoteNotFound] = useState(false)
    const [formattedDate, setFormattedDate] = useState(null)
    const [loading, setLoading] = useState(false)
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
    const currentPath = window.location.href

    useEffect(()=> {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`/api/retrieve-note/${id}`, { withCredentials: true })
                setNoteNotFound(false)
                setNote(response.data)
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

    const handleNoteAuth = () => {
        setIsNoteAuth(true)
      }

    if (loading) {
        return <div>Loading...</div>
      }

    if (noteNotFound) {
        return <div>No note found</div>
      }

      const copyText = (el) => {
        var copiedEl
        var disabledEl
        var ref
    
        if ((el === 'note-id' && copyDisabled.disabledId) || (el === 'note-path' && copyDisabled.disabledPath))  {
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
                ref.current.select()
                navigator.clipboard.writeText(ref.current.value)
                copiedEl()
                disabledEl()
                setTimeout(()=> {
                    copiedEl()
                    disabledEl()
                } ,2000)
        }

    return(
        <>
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
            <h1>{note.noteTitle}</h1>
            <span>{formattedDate} - <span className="publicity-span">{note.notePublicity === 'Private' ? 'Private (password protected)' : 'Public (viewed by everyone)'}</span></span>

            <form className="form-note">
                <div className="form-note-wrapper">
                    <textarea 
                        className="form-note-textarea" 
                        name="noteData"
                        rows="15" 
                        maxLength="2000"
                        value={note.noteData}
                        readOnly
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
                        <label htmlFor="note-id">{copiedData.copiedId ? 'Copied to clipboard' : ''}</label>
                </div>
            
                <div className="note-info-wrapper">
                        <label htmlFor="note-path">Note Path:</label>
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
                        <label htmlFor="note-path">{copiedData.copiedPath ? 'Copied to clipboard' : ''}</label>
                </div>
            </form>
            </>)
        }
        </>
    )
}
export default NoteView