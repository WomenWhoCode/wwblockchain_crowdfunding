import { useState,useEffect } from 'react'
import { useWeb3 } from "@3rdweb/hooks"
import styles from '../../styles/Home.module.css'

import { contractAddress } from '../../config.js'
import CampaignFactorySC from '../../utils/CampaignFactory.json'
import { ethers } from 'ethers'

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
  // ethereum start
  try {
    const { ethereum } = window
    if (ethereum) {
      console.log('ethereum....',ethereum)
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const campaignFactoryContract = new ethers.Contract(
            contractAddress,
            CampaignFactorySC.abi,
            signer
        )
        let cmp = await campaignFactoryContract.createCampaign(minimum_contr_amt, 3, campaign_name, campaign_desc, img_url, target_amt);
        console.log('createCampaign....', cmp)
        //tx = await campaignFactoryContract.getDeployedCampaigns()
        //console.log('getting DeployedCampaigns....', tx)
        setLoadingState(1)
        alert(`Create Campaign : Success`);
    } else {
        console.log("Ethereum object doesn't exist!")
    }
} catch (error) {
    console.log('Error creating campaign', error)
    alert(`Error creating campaign: error`);
    // setTxError(error.message)
} 
  // ethereum end

    // const res = await fetch('/api/request', {
    //   body: JSON.stringify({
    //     minimum_contr_amt: minimum_contr_amt,
    //     campaign_name: campaign_name,
    //     campaign_desc: campaign_desc,
    //     img_url: img_url,
    //     target_amt: target_amt
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',
    // });
   // const result = await res.json();
    
   alert(`Create Campaign : Success`);
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
       <button className="request-button" type="submit">Submit Request</button>
     </form>
 );
 const { connectWallet, address, error } = useWeb3();
 error ? console.log(error) : null;
   return ( 
      <div><h1>New Campaign Request</h1>
      { address ? (
              <h3 className={styles.text}>walletAddress: {address}</h3>
            ) : (
              <button className={styles.btn} onClick={()=>connectWallet("injected")}>Connect Wallet</button>
            )}  
      {NewCampaignForm}
     </div>
    );
   }
   
   export default NewRequest;
   