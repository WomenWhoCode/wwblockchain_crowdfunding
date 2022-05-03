import Link from "next/link";

const Navbar = () => {
    return ( 
       <nav>
            <div className="logo">
            <h1>Just Fund</h1>
            </div>
            <Link href="/"><a>Home</a></Link>
            <Link href="/campaign"><a>Campaign Lists</a></Link>
            <Link href="/campaign/new"><a>Create Campaign</a></Link>
       </nav>
    );
   }
   
   export default Navbar;