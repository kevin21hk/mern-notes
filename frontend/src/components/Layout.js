import Header from './Header'
import Sidebar from './Sidebar'
import Nav from './Nav'
import {Outlet} from 'react-router-dom'
import Footer from './Footer'

const Layout = () => {

    return(
        <>
            <Header/>
            <Sidebar/>
            <Nav/>
            <Outlet/>
            <Footer/>
        </>
    )
}
export default Layout