import Header from './Header'
import Sidebar from './Sidebar'
import Nav from './Nav'
import {Outlet} from 'react-router-dom'
import Footer from './Footer'

const Layout = () => {

    return(
        <>
        <section className='spiral-top'/>
        <div className="container">
            <header className="header">
            <Header/>
            </header>
            <main className="main">
                <aside className="sidebar">
                <Sidebar/>
                </aside>
                <section className="content">
                    <nav className="nav">
                    <Nav/>
                    </nav>
                    <section className="content-section">
                    <Outlet/>
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