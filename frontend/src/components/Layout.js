import React from 'react'
import {useState, useEffect} from 'react'
import axios from './Axios'
import Header from './Header'
import Sidebar from './Sidebar'
import Nav from './Nav'
import {Outlet} from 'react-router-dom'
import Footer from './Footer'

const Layout = () => {

    const [publicNotes, setPublicNotes] = useState([])

    const updatePublicNotes = (newNote) => {
    setPublicNotes((prevNotes) => [newNote,...prevNotes])
    }
  
    useEffect(()=> {
        const fetchPublicNotes = async() => {
            try {
                const publicNotesData = await axios.get('/api/get-public-notes', { withCredentials: true })
                if (publicNotesData) {
                    setPublicNotes(
                        publicNotesData.data.map(({ noteHash, noteTitle }) => ({ noteHash, noteTitle }))
                        )
                }
                } catch (err) {
                console.error('Error', err)
            }
        }
        fetchPublicNotes()
    },[])

    return(
        <>
        <section className='spiral-top'/>
        <div className="container">
            <header className="header">
            <Header/>
            </header>
            <main className="main">
                <aside className="sidebar">
                <Sidebar publicNotes={publicNotes}/>
                </aside>
                <section className="content">
                    <nav className="nav">
                    <Nav/>
                    </nav>
                    <section className="content-section">
                    <Outlet context={updatePublicNotes}/>
                    </section>
                </section>
            </main>
            <footer className="footer">
            <Footer/>
            </footer>
        </div>
        </>
    )
}
export default Layout