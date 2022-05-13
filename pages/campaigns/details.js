/** 
 * New campaign create page 
 * abhattachan
 * 02 May 2022
 */
import { useState,useEffect } from 'react'
import { useWeb3 } from "@3rdweb/hooks"
import styles from '../../styles/Home.module.css'

import CampaignSC from '../../utils/CampaignFactory.json'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

const CampaignDetailsPage = () => {
    const router = useRouter()
    const { pid } = router.query
    const [campaignDetails, setCampaignDetails] = useState([])
    const [loadingState, setLoadingState] = useState(0)
    const [txError, setTxError] = useState(null)
    const [currentAccount, setCurrentAccount] = useState('')
    const [correctNetwork, setCorrectNetwork] = useState(false)
 
    // Checks if wallet is connected
    const checkIfWalletIsConnected = async () => {
         const { ethereum } = window
         if (ethereum) {
             console.log('Got the ethereum obejct: ', ethereum)
         } else {
             console.log('No Wallet found. Connect Wallet')
         }
 
         const accounts = await ethereum.request({ method: 'eth_accounts' })
 
         if (accounts.length !== 0) {
             console.log('Found authorized Account: ', accounts[0], pid)
             setCurrentAccount(accounts[0])
         } else {
             console.log('No authorized account found')
         }
     }
  
     // Checks if wallet is connected to the correct network
     const checkCorrectNetwork = async () => {
         const { ethereum } = window
         let chainId = await ethereum.request({ method: 'eth_chainId' })
         console.log('Connected to chain:' + chainId)
 
         const rinkebyChainId = '0x4'
 
         const devChainId = 1337
         const localhostChainId = `0x${Number(devChainId).toString(16)}`
 
         if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
             setCorrectNetwork(false)
         } else {
             setCorrectNetwork(true)
         }

        }
        
        useEffect(() => {
          checkIfWalletIsConnected()
          checkCorrectNetwork()
          getCampaignDetails()
     }, [])

    const getCampaignDetails = async () => {
      try {
          const { ethereum } = window

          if (ethereum) {
              console.log('get details for: '+ pid  )
              const provider = new ethers.providers.Web3Provider(ethereum)
              const signer = provider.getSigner()
              const campaignContract = new ethers.Contract(
                  pid,
                  CampaignSC.abi,
                  signer
              )
              let resp = await campaignContract.getDetails()
              let details = { 'address': pid, 'details': resp }
              console.log("Get campaign details: ", details)
              setCampaignDetails( arr => [...arr, details])

              setLoadingState(1)
          } else {
              console.log("Ethereum object doesn't exist!")
          }
      } catch (error) {
          console.log(error)
          setTxError(error.message)
      }
    }
  
    return <div className='font-semibold text-lg text-center mb-4'><p>Campaign Address: {pid}</p></div>
  }
  
export default CampaignDetailsPage