import React from 'react';
import axios from './Axios'
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'

const NoteView = () => {

    const {id} = useParams()
    const [note, setNote] = useState(null)
    const [loading, setLoading] = useState(true)

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
    return(
        <>
        <h1>NOTE VIEW</h1>

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
        </form>
        </>
    )
}
export default NoteView