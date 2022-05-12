import { useTheme, 
         Text, 
         Link 
      } from '@nextui-org/react';


 

const Navbar = () => {
   const theme = useTheme(); 

    return ( 
       <nav>
            <div className="logo">
               <Text h2 color="secondary"> Just Fund </Text>
            </div>
            <Link color="secondary" href="/">Home</Link>
            <Link color="secondary" href="/campaigns">Campaign List</Link>
            <Link color="secondary" href="/campaigns/new">Create Campaign</Link>
       </nav>
    );
   }
   
   export default Navbar;