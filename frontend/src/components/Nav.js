import React from "react";
import { Link } from "react-router-dom"

const Nav = () => {

    return(
        <>
        <ul className="ul-nav">
            <li>
            <Link to='/create-note'>Create Note</Link>
            </li>
            <li>
            <Link to='/'>Instructions</Link>
            </li>
            <li>
            <Link to='/about'>About</Link>
            </li>
        </ul>
        </>
    )
}
export default Nav