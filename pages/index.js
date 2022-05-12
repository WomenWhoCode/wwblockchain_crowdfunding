import Head from 'next/head'
import { useState } from 'react'
import { useWeb3 } from "@3rdweb/hooks"
import styles from '../styles/Home.module.css'
import { Container, Card, Row, Text, Button, css } from "@nextui-org/react"; 

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
            <Container>
              <h1 className={styles.title}>
                  Welcome to JustFund App!
              </h1>
              <Card>
                <Row justify="center" align="center">
                <Text
                  css={{
                    color: '$purple50', 
                    fontSize: 'xs', 
                    padding: '$2 $4'
                  }}
                >
                  A decentralized crowdfunding platform 

                </Text>

                </Row>
              </Card>
              { address ? (
                <h3 >walletAddress: {address}</h3>
              ) : (
                //<button className={styles.btn} onClick={()=>connectWallet("injected")}>Connect Wallet</button>
                <Button className={styles.btn} 
                        color="gradient" 
                        auto ghost 
                        onClick={()=>connectWallet("injected")}>
                          Connect Wallet
                </Button>
              )}
            </Container>
            
              
             
             
              
              
          
     
        </>
    )
}