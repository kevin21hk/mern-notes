/* eslint-disable no-unused-vars */
import React from "react"
import { Link } from "react-router-dom"

const Sidebar = ({ publicNotes , noPublicNotes }) => {

    return(
        <>
            <h3 className="recent-notes-header">
            Recent Public Notes
            </h3>
            { noPublicNotes ? (
                <p>No public notes found</p>
            ) : (
            <ul className="public-notes" 
                id="public-notes">
                { publicNotes.map((note, index) =>
                (
                    <Link key={ note.noteHash } to={ `/view-note/${note.noteHash}` }>
                        <li className="public-notes-list">
                            { note.noteTitle }
                        </li>
                    </Link>
                )    
                )}
            </ul>
            )}
        </>
    )  
}
export default Sidebar