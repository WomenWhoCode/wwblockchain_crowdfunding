
//this will list all available campaigns
import { useState, useEffect } from 'react'
import { contractAddress } from '../../config.js'
import CampaignFactorySC from '../../utils/CampaignFactory.json'
import CampaignSC from '../../utils/Campaign.json'
import { ethers } from 'ethers'
import axios from 'axios'
//import { Button } from '"@nextui-org/react"'



const Campaign = () => {
   const [campaignsList, setCampaignsList] = useState(null)
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
            console.log('Found authorized Account: ', accounts[0])
            setCurrentAccount(accounts[0])
        } else {
            console.log('No authorized account found')
        }
    }

    // Calls Metamask to connect wallet on clicking Connect Wallet button
    const connectWallet = async () => {
        try {
            const { ethereum } = window

            if (!ethereum) {
                console.log('Metamask not detected')
                return
            }
            let chainId = await ethereum.request({ method: 'eth_chainId' })
            console.log('Connected to chain:' + chainId)

            const rinkebyChainId = '0x4'

            const devChainId = 1337
            const localhostChainId = `0x${Number(devChainId).toString(16)}`

            if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
                alert('You are not connected to the Rinkeby Testnet!')
                return
            }

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

            console.log('Found account', accounts[0])
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log('Error connecting to metamask', error)
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
        getCampaignsList()
    }, [])

    // retrieve list of campaigns
    const getCampaignsList = async () => {
        try {
            const { ethereum } = window

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const campaignFactoryContract = new ethers.Contract(
                    contractAddress,
                    CampaignFactorySC.abi,
                    signer
                )

                let tx = await campaignFactoryContract.getDeployedCampaigns()
                console.log('getting DeployedCampaigns....', tx)
                setCampaignsList(tx)
                tx.map((campaignAddress) => {
                    console.log('retrieved Campaign details for address> ', campaignAddress)
                    getCampaignDetails(campaignAddress)
                    .then((details) => 
                        console.log('retrieved Campaign details!', details)
                    )
                })

                setLoadingState(1)

            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log('Error minting character', error)
            setTxError(error.message)
        }
    }

    const getCampaignDetails = async (tokenId) => {
        try {
            const { ethereum } = window

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const campaignContract = new ethers.Contract(
                    tokenId,
                    CampaignSC.abi,
                    signer
                )
                let details = await campaignContract.getDetails()
                console.log("Get campaign details: ", details)
                setCampaignDetails( arr => [...arr, details])
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log(error)
            setTxError(error.message)
        }
    }

    return ( 
       <div>
          <h1>List of Campaigns</h1>

          {currentAccount === '' ? (
                <button
                    className='text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
                    onClick={connectWallet}
                >
                    Connect Wallet
                </button>
            ) : correctNetwork ? (
                <div></div>
            ) :  (
               <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
                   <div>----------------------------------------</div>
                   <div>Please connect to the Rinkeby Testnet</div>
                   <div>and reload the page</div>
                   <div>----------------------------------------</div>
               </div>
           )}

           
            {loadingState === 0 ? (
                    txError === null ? (
                        <div className='flex flex-col justify-center items-center'>
                            <div className='text-lg font-bold'>
                                Processing your transaction
                            </div>
                        </div>
                    ) : (
                        <div className='text-lg text-red-600 font-semibold'>{txError}</div>
                    )
            ) : (
                <div className='flex flex-col justify-center items-center'>
                     <div className='font-semibold text-lg text-center mb-4'>
                        <ul>
                            {campaignsList ? (
                                campaignsList.map((value) => {
                                    return <li key={value}>{value}</li>
                                }) ) : ( <span></span> ) 
                            }
                        </ul>
                     </div>
                     <div className='font-semibold text-lg text-center mb-4'>
                         {campaignDetails && campaignDetails[0] ? (
                             <><h1>Campaign details with index 0</h1><span>Minimum payment: {parseInt(campaignDetails[0]['minPayment']._hex, 16)}</span><br /><span>Name: {campaignDetails[0]['name']}</span><br /><span>Description: {campaignDetails[0]['description']}</span><br /><span>Image: {campaignDetails[0]['image']}</span><br /><span>Fund raised: {parseInt(campaignDetails[0]['fundReceived']._hex, 16)}</span><br /></>
                         ) : ( <span></span> )
                         } 
                    </div>
                    <div className='font-semibold text-lg text-center mb-4'>
                         {campaignDetails && campaignDetails[1] ? (
                             <><h1>Campaign details with index 1</h1><span>Minimum payment: {parseInt(campaignDetails[1]['minPayment']._hex, 16)}</span><br /><span>Name: {campaignDetails[1]['name']}</span><br /><span>Description: {campaignDetails[1]['description']}</span><br /><span>Image: {campaignDetails[1]['image']}</span><br /><span>Fund raised: {parseInt(campaignDetails[1]['fundReceived']._hex, 16)}</span><br /></>
                         ) : ( <span></span> )
                         } 
                    </div>
                    <div className='font-semibold text-lg text-center mb-4'>
                         {campaignDetails && campaignDetails[2] ? (
                             <><h1>Campaign details with index 2</h1><span>Minimum payment: {parseInt(campaignDetails[2]['minPayment']._hex, 16)}</span><br /><span>Name: {campaignDetails[2]['name']}</span><br /><span>Description: {campaignDetails[2]['description']}</span><br /><span>Image: {campaignDetails[2]['image']}</span><br /><span>Fund raised: {parseInt(campaignDetails[2]['fundReceived']._hex, 16)}</span><br /></>
                         ) : ( <span></span> )
                         } 
                    </div>
                </div>
            )}
       </div>
   );
   }
   
   export default Campaign;
   