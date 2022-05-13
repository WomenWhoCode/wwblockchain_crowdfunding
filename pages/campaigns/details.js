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
import { useRouter } from 'next/router'

const CampaignDetailsPage = () => {
    const router = useRouter()
    const { pid } = router.query
  
    return <p>CampaignDetailsPage: {pid}</p>
  }
  
export default CampaignDetailsPage