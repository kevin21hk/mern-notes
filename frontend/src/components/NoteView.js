import React from 'react'
import axios from './Axios'
import {useEffect, useState, useRef} from 'react'
import {useParams} from 'react-router-dom'
import Password from './Password'

const NoteView = () => {

    const {id} = useParams()
    const [note, setNote] = useState()
    const [loading, setLoading] = useState(true)
    const [copiedData, setCopiedData] = useState({
        copiedId : false,
        copiedPath : false
    })
    const [copyDisabled, setCopyDisabled] = useState({
        disabledId : false,
        disabledPath : false
    })

    const idRef = useRef(null)
    const pathRef = useRef(null)
    const currentPath = window.location.href

    useEffect(()=> {
        const fetchNote = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`/api/retrieve-note/${id}`)
                setNote(response.data)
            } catch(err) {
                console.error('Error', err)
            } finally {
                setLoading(false)
            }
        }

    fetchNote()
    }, [id])

    if (loading) {
        return <div>Loading...</div>
      }

    if (!note) {
        return <div>No note found</div>;
      }

      note.createdAt = new Date(note.createdAt);
      const options = {
        weekday: 'short',
        day: '2-digit',     
        month: 'short',    
        year: 'numeric',    
        hour: 'numeric',     
        minute: '2-digit',     
        hour12: false 
      };
      
      const formattedDate = note.createdAt.toLocaleString('en-US', options)

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
        <Password/>
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
        </>
    )
}
export default NoteView