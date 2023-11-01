import React from 'react'
import {Link} from 'react-router-dom'
import logoImg from '../images/mern-notes-logo.png'

const Header = () => {

    return(
        <>
        <Link to='/create-note/'>
            <img src={logoImg} className="logo-image" alt="logo" />
        </Link>
        </>
    )
}
export default Header