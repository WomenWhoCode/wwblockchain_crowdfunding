import Link from "next/link";

const Navbar = () => {
    return ( 
       <nav>
            <div className="logo">
            <h1>Just Fund</h1>
            </div>
            <Link href="/"><a>Home</a></Link>
            <Link href="/campaigns"><a>Campaign List</a></Link>
            <Link href="/campaigns/new"><a>Create Campaign</a></Link>
       </nav>
    );
   }
   
   export default Navbar;