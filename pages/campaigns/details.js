/** 
 * New campaign create page 
 * abhattachan
 * 02 May 2022
 */
import { useState, useEffect } from 'react'
import { contractAddress } from '../../config.js'
import CampaignFactorySC from '../../utils/CampaignFactory.json'
import CampaignSC from '../../utils/Campaign.json'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { Link, Button } from '@nextui-org/react'
import styles from '../../styles/Home.module.css'

const CampaignDetailsPage = () => {
    const router = useRouter()
    const { pid } = router.query
    const [campaignsList, setCampaignsList] = useState(null)
    const [campaignDetails, setCampaignDetails] = useState(null)
    const [loadingState, setLoadingState] = useState(0)
    const [txError, setTxError] = useState(null)
    const [currentAccount, setCurrentAccount] = useState('')
    const [correctNetwork, setCorrectNetwork] = useState(false)
      
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window
      if (ethereum) {
          console.log('Got the ethereum obejct: ', ethereum)
      } else {
          console.log('No Wallet found. Connect Wallet')
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
          console.log('Found authorized Account: ', accounts[0], ethers.utils.getAddress(accounts[0]))
          setCurrentAccount(ethers.utils.getAddress(accounts[0]))
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
            let resp = await campaignContract.getDetails()
            let details = { 'address': tokenId, 'details': resp }
            console.log("Get campaign details: ", details)
            setCampaignDetails(details)
        } else {
            console.log("Ethereum object doesn't exist!")
        }
    } catch (error) {
        console.log(error)
        setTxError(error.message)
    }
}
  
    return <div className='font-semibold text-lg text-center mb-4'>
        <p>Campaign Address: {pid}</p>
        {campaignDetails ? (campaignDetails.details['owner'] !== currentAccount ? ( 
            <><h3>{campaignDetails.details['name']}</h3><br />
             <span> <img src={campaignDetails.details['image']} ></img></span><br />
            <br /><span>Description: {campaignDetails.details['description']}</span><br />
            <span>Target Fund: {parseInt(campaignDetails.details['targetAmt']._hex, 16)} ETH</span><br />
            <span>Fund raised: {parseInt(campaignDetails.details['fundReceived']._hex, 16)} ETH</span><br />
            <br></br>
            <span>Minimum payment: {parseInt(campaignDetails.details['minPayment']._hex, 16)} ETH</span>
            <Link block color="secondary" href={"https://rinkeby.etherscan.io/address/"+campaignDetails.address}>View on Rinkeby Etherscan</Link>
            <h2>Contribute Now!</h2>
            <label htmlFor="target_amt">Amount in Ether you want to contribute</label>
            <input type="text" id="target_amt" name="target_amt" required />
        <br></br>
            <Link block color="secondary" href={"/campaigns/contibute?pid="+campaignDetails.address}>Contribute</Link><br />
             </>
          ) : ( 
            <><h3>{campaignDetails.details['name']}</h3> <br />
            <span>
            <img alt="Picture of the campaign" width={516} height={315}  src={campaignDetails.details['image']} ></img> 
            </span><br />
            <span>Description: {campaignDetails.details['description']}</span><br />
            <span>Target Fund: {parseInt(campaignDetails.details['targetAmt']._hex, 16)} ETH</span><br />
            <span>Fund raised: {parseInt(campaignDetails.details['fundReceived']._hex, 16)} ETH</span><br />
            <span>Minimum payment: {parseInt(campaignDetails.details['minPayment']._hex, 16)} ETH</span>
            <br />
            <Link block color="secondary" href={"/campaigns/request?pid="+campaignDetails.address}>Withdrawal Request</Link>
            <br /> 
            <Link block color="secondary" href={"https://rinkeby.etherscan.io/address/"+campaignDetails.address}>View on Rinkeby Etherscan</Link>
            </>
          )
        ) 
        : ( 
          <Button className={styles.btn} color="gradient" auto ghost onPress={()=>getCampaignDetails(pid)}>get details</Button> 
        ) }
      </div>
  }
  
export default CampaignDetailsPage