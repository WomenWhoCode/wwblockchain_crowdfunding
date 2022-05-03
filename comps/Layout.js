import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({children}) => {
    return ( 
        <div className="content">
            <Navbar />
            {children}
            <br></br>
            <Footer />
        </div>
    );
   }
   
   export default Layout;