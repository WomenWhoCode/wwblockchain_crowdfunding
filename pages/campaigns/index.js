//this will list all available campaigns
import { useState, useEffect } from 'react'
import { contractAddress } from '../../config.js'
import CampaignFactorySC from '../../utils/CampaignFactory.json'
import CampaignSC from '../../utils/Campaign.json'
import { ethers } from 'ethers'
import axios from 'axios'

const Campaign = () => {
   const [campaignsList, setCampaignsList] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
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

                setLoadingState(1)
                console.log('retrieved Campaigns!', tx)

                setCampaignsList(tx)
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log('Error minting character', error)
            setTxError(error.message)
        }
    }
/*
    // Gets the minted NFT data
    const getCampaignDetails = async (tokenId) => {
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

                let tokenUri = await campaignFactoryContract.tokenURI(tokenId)
                let data = await axios.get(tokenUri)
                let meta = data.data

                setCampaignDetails(meta)  // mint.image
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log(error)
            setTxError(error.message)
        }
    }*/

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
                <button
                    className='text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
                    onClick={getCampaignsList}
                >
                    get Campaigns List
                </button>
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
                     <h1>Retrieved from blockchaing:</h1>
                     <div className='font-semibold text-lg text-center mb-4'>
                        {campaignsList}
                     </div>
                    
                </div>
            )}
        
       <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
       </div>
   );
   }
   
   export default Campaign;
   