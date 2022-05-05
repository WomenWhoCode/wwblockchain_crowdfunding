import Head from 'next/head'
import { useState } from 'react'
import { useWeb3 } from "@3rdweb/hooks"
import styles from '../styles/Home.module.css'

export default function Home() {

  /*
    async function connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

      }
    }
*/

    const { connectWallet, address, error } = useWeb3();
    error ? console.log(error) : null;

    return (
        <>
            <Head>
                <title>JustFund App</title>
            </Head>
            <main>
              <h1 className={styles.title}>
                  Welcome to JustFund App!
              </h1>
             
              { address ? (
                <h3 className={styles.text}>walletAddress: {address}</h3>
              ) : (
                <button className={styles.btn} onClick={()=>connectWallet("injected")}>Connect Wallet</button>
              )}
              
              
            </main>
     
        </>
    )
}