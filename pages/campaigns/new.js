

const NewRequest = () => {
   // Handles the submit event on form submit.
  const handleSubmit = async (event) => {
   // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    const minimum_contr_amt = event.target.minimum_contr_amt.value;
    const campaign_name = event.target.campaign_name.value;
    const campaign_desc = event.target.campaign_desc.value;
    const img_url = event.target.img_url.value;
    const target_amt = event.target.target_amt.value;
    const res = await fetch('/api/request', {
      body: JSON.stringify({
        minimum_contr_amt: minimum_contr_amt,
        campaign_name: campaign_name,
        campaign_desc: campaign_desc,
        img_url: img_url,
        target_amt: target_amt
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const result = await res.json();
    alert(`Request Campaign name: ${result.msg}`);

  }
  const NewCampaignForm = (
      <form className="container" onSubmit={handleSubmit}>
       <label htmlFor="minimum_contr_amt">Minimum Contribution Amount</label>
       <input type="text" id="minimum_contr_amt" name="minimum_contr_amt" required />   
       <label htmlFor="campaign_name">Campaign Name</label>
       <input type="text" id="campaign_name" name="campaign_name" required />  
      <label htmlFor="campaign_desc">Campaign Description</label>
       <textarea id="campaign_desc" name="campaign_desc" required />
       <label htmlFor="img_url">Image URL</label>
       <input type="text" id="img_url" name="img_url" required />
      
       <label htmlFor="target_amt">Target Amount</label>
       <input type="text" id="target_amt" name="target_amt" required />
       <br></br>
       <br></br>
       <button className="request-button" type="submit">Connect Wallet</button>
     </form>
 );
   return ( 
      <div><h1>New Campaign Request</h1>
      {NewCampaignForm}
     </div>
    );
   }
   
   export default NewRequest;
   