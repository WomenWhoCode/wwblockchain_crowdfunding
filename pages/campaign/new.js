import Navbar from '../../comps/Navbar'; 
import Footer from '../../comps/Footer';

const NewRequest = () => {
   // Handles the submit event on form submit.
  const handleSubmit = async (event) => {
   // Stop the form from submitting and refreshing the page.
  }
  const NewCampaignForm = (
      <form className="container" onSubmit={handleSubmit}>
       <label htmlFor="minimum_contr_amt">Minimum Contribution Amount</label>
       <input type="text" id="minimum_contr_amt" name="minimum_contr_amt" required />   
       <label htmlFor="campaign_name">Campaign Name</label>
       <input type="text" id="campaign_name" name="campaign_name" required />  
      <label htmlFor="campaign_desc">Campaign Description</label>
       <input type="textarea" id="campaign_desc" name="campaign_desc" required />
       <label htmlFor="img_url">Image URL</label>
       <input type="text" id="img_url" name="img_url" required />
      
       <label htmlFor="target_amt">Target Amount</label>
       <input type="text" id="target_amt" name="target_amt" required />
       <button type="submit">Connect Wallet</button>
     </form>
 );
   return ( 
      
    
      <div><h1>New Campaign</h1>
      {NewCampaignForm}
     </div>
    );
   }
   
   export default NewRequest;
   