import React from "react";

const Footer = () => {

    const currentYear = new Date().getFullYear()
    return(
        <>
        <span>Copyright &copy; {currentYear} Kevin21HK MERN-Notes Project</span>
        </>
    )
}
export default Footer