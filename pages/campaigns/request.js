/** 
 * New campaign create page 
 * abhattachan
 * 02 May 2022
 */
 import { useState,useEffect } from 'react'
 import { useWeb3 } from "@3rdweb/hooks"
 import styles from '../../styles/Home.module.css'
 
 import { contractAddress } from '../../config.js'
 import CampaignFactorySC from '../../utils/CampaignFactory.json'
 import { ethers } from 'ethers'
 import { Button, Text, Input, Grid } from '@nextui-org/react'
 
 const FundRequest = () => {
    // Handles the submit event on form submit.
    const handleSubmit = async (event) => {
      alert("Submit Request Success")
    }
  //  const handleSubmit = async (event) => {
  //   // Stop the form from submitting and refreshing the page.
  //    event.preventDefault();
  //    const minimum_contr_amt = event.target.minimum_contr_amt.value;
  //    const campaign_name = event.target.campaign_name.value;
  //    const campaign_desc = event.target.campaign_desc.value;
  //    const img_url = event.target.img_url.value;
  //    const target_amt = event.target.target_amt.value;
  //  // ethereum start 
  //  try {
  //    const { ethereum } = window
  //    if (ethereum) {
  //      console.log('ethereum....',ethereum)
  //        const provider = new ethers.providers.Web3Provider(ethereum)
  //        const signer = provider.getSigner()
  //        const campaignFactoryContract = new ethers.Contract(
  //            contractAddress,
  //            CampaignFactorySC.abi,
  //            signer
  //        )
  //        let cmp = await campaignFactoryContract.createCampaign(minimum_contr_amt, 3, campaign_name, campaign_desc, img_url, target_amt);
  //        console.log('createCampaign....', cmp)
  //        setLoadingState(1)
  //        alert(`Create Campaign : Success`);
  //    } else {
  //        console.log("Ethereum object doesn't exist!")
  //    }
  //  } catch (error) {
  //    console.log('Error creating campaign', error)
  //    alert(`Error creating campaign: error`);
  //    // setTxError(error.message)
  //  } 
  //  // ethereum end
  //    // const res = await fetch('/api/request', {
  //    //   body: JSON.stringify({
  //    //     minimum_contr_amt: minimum_contr_amt,
  //    //     campaign_name: campaign_name,
  //    //     campaign_desc: campaign_desc,
  //    //     img_url: img_url,
  //    //     target_amt: target_amt
  //    //   }),
  //    //   headers: {
  //    //     'Content-Type': 'application/json',
  //    //   },
  //    //   method: 'POST',
  //    // });
  //   // const result = await res.json();
  //   alert(`Create Campaign : Success`);

   const NewRequestForm = (
       <form className="container" onSubmit={handleSubmit}>
       <label htmlFor="campaign_desc">Request Description</label>
        <textarea id="campaign_desc" name="campaign_desc" required />
        <label htmlFor="img_url">Amount in Ether</label>
        <input type="text" id="img_url" name="img_url" required />  
        <label htmlFor="target_amt">Recipient Ethereum Wallet Address</label>
        <input type="text" id="target_amt" name="target_amt" required />
        <br></br>
        <br></br>
        <Button  color="gradient" className="request-button" type="submit">Submit Request</Button>
      </form>
  );
  const { connectWallet, address, error } = useWeb3();
  error ? console.log(error) : null;
    return ( 
      <>
       <div className={styles.title}>
         <Text
           h2 
           css={{
             textGradient: "45deg, $blue600 -20%, $pink600 50%",
             }}>Create a Withdrawal Request</Text>
         </div>
       <div>
       {NewRequestForm}
      </div>
      </>
     );
    }
    
    export default FundRequest;
    