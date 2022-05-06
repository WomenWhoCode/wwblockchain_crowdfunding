import Link from "next/link";
import { useTheme, Text } from '@nextui-org/react';


 

const Navbar = () => {
   const theme = useTheme(); 

    return ( 
       <nav>
            <div className="logo">
            <Text
               css={{
               color: '$blue800',
               }}> <h1>Just Fund</h1> 
          </Text>
           
            </div>
            <Link href="/"><a>Home</a></Link>
            <Link href="/campaigns"><a>Campaign List</a></Link>
            <Link href="/campaigns/new"><a>Create Campaign</a></Link>
       </nav>
    );
   }
   
   export default Navbar;