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
            <div className={styles.title}>
              <Text
                h1 
                css={{
                  textGradient: "45deg, $blue600 -20%, $pink600 50%",
                  }}>
              
                  Welcome to JustFund App!
              </Text>
              </div>
              <Card>
                <Row justify="center" align="center">
                <Text
                  css={{
                    color: '$purple50', 
                    fontSize: 'xs', 
                    padding: '$2 $4'
                  }}
                >
                  A decentralized crowdfunding platform.
                </Text>
                </Row>
                <Row justify="center" align="center">
                <Text
                  css={{
                    color: '$purple50', 
                    fontSize: 'xs', 
                    padding: '$2 $4'
                  }}
                >
                  Any project has a chance of getting visibility and getting funded.
                </Text>
                </Row>
                <Row justify="center" align="center">
                <Text
                  css={{
                    color: '$purple50', 
                    fontSize: 'xs', 
                    padding: '$2 $4'
                  }}
                >
                  No fees. Our crowdfunding less expensive for creators and investors.
                </Text>
                </Row>
              </Card>
              { address ? (
                <h3 >walletAddress: {address.substring(0, 5)+'.....'+address.substring(address.length-4, address.length)}</h3>
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