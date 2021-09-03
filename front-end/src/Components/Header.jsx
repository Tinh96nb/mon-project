// @ts-nocheck
import { useEffect, useState } from 'react'
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import TOKEN_ABI from 'utils/abi/TOKEN_ABI.json';
import NFT_ABI from 'utils/abi/NFT_ABI.json';
import MARKET_ABI from 'utils/abi/MARKET_ABI.json';

import {Container, Col, Row, Form} from 'react-bootstrap'
import { FaTimes, FaSearch } from "react-icons/fa";
import Logo from './UI/Logo';
import MainMenu from './UI/MainMenu';
import { useDispatch } from 'react-redux';
import { setAddress, setEnvContract } from 'redux/homeReducer';

const {
  REACT_APP_CONTRACT_TOKEN,
  REACT_APP_CONTRACT_NFT,
  REACT_APP_CONTRACT_MARKET,
  REACT_APP_PORT_RPC,
  REACT_APP_RPC,
  REACT_APP_BRIDGE,
  REACT_APP_NETWORK_NAME,
} = process.env

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: REACT_APP_RPC,
        [REACT_APP_PORT_RPC]: REACT_APP_RPC,
      },
      network: "binance",
      chainId: REACT_APP_PORT_RPC,
      bridge: REACT_APP_BRIDGE,
    },
  },
};

const Header = () => {

  const [headerNav, setHeader] = useState(false);
  const [mobileNav, mobileNavSet] = useState(false);
  const [search, searchSet] = useState(false);

  const dispatch = useDispatch();

  const changeMenuStyle =() => {
    if(window.scrollY >= 80){
      setHeader(true)
    }
    else{
      setHeader(false)
    }
  }
  window.addEventListener('scroll', changeMenuStyle);

  useEffect(() => {
    window.addEventListener("load", async () => {
      // if not logined
      const webModal = new Web3Modal({
        network: REACT_APP_NETWORK_NAME,
        cacheProvider: true,
        providerOptions,
      });
      if (!webModal.cachedProvider) {
        const provider = new Web3.providers.HttpProvider(REACT_APP_RPC);
        const web3 = new Web3(provider);
        setRedux(web3);
        return;
      }
      await setConnect(webModal);
    });
  }, []);

  const setRedux = async (web3) => {
    const accounts = await web3.eth.getAccounts();
    const userAcc = accounts.length ? accounts[0] : null;
    dispatch(setAddress(userAcc));
    const ctToken = new web3.eth.Contract(TOKEN_ABI, REACT_APP_CONTRACT_TOKEN);
    const ctNFT = new web3.eth.Contract(NFT_ABI, REACT_APP_CONTRACT_NFT);
    const ctMarket = new web3.eth.Contract(MARKET_ABI, REACT_APP_CONTRACT_MARKET);

    dispatch(
      setEnvContract({
        web3: web3,
        contractToken: ctToken,
        contractNFT: ctNFT,
        contractMarket: ctMarket
      })
    );
  };

  const setConnect = async (web3Modal) => {
    let web3 = null;
    try {
      const provider = await web3Modal.connect();
      web3 = new Web3(provider);
    } catch (error) {
      const provider = new Web3.providers.HttpProvider(REACT_APP_RPC);
      web3 = new Web3(provider);
    }
    setRedux(web3);
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async function () {
        const accounts = await web3.eth.getAccounts();
        accounts.length && dispatch(setAddress(accounts[0]));
      });
      window.ethereum.on("chainChanged", async (netId) => {
        if (netId.toString() !== REACT_APP_PORT_RPC) switchNetWork();
        setRedux(web3);
      });
    }
    if (web3.eth && window.ethereum) {
      const netId = await web3.eth.net.getId();
      if (netId.toString() !== REACT_APP_PORT_RPC) switchNetWork();
    }
  };


  const switchNetWork = async () => {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${parseInt(REACT_APP_PORT_RPC || "").toString(16)}`,
          chainName: REACT_APP_NETWORK_NAME,
          nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: [REACT_APP_RPC],
          blockExplorerUrls: ["https://bscscan.com"],
        },
      ],
    });
  };

  return (
    <>
      <div className={headerNav ? 'header black-bg header_sticky' : 'header black-bg'}>
          <Container>
            <Row className="header-content">
            
                <Col xs="6" md="3" lg="3" className="align-items-center">
                  <Logo />
                </Col>
                <Col lg="5" md="3" className="align-items-center d-none d-md-block">
                  <div className="search-bar">
                    <Form>
                      <Form.Group controlId="searchMobile">
                        <Form.Control type="Search" placeholder="Search" />
                        
                      </Form.Group>
                    </Form>
                  </div>
                </Col>

                <Col xs="4" className="text-right align-self-center d-md-none">
                  <div onClick={()=>searchSet(true)} className="mobile-search-icon">
                    <FaSearch />
                  </div>
                </Col>

                <Col lg="4" md="6" className="text-right align-self-center d-none d-md-block">
                  <div className="menu-area">
                    <div className="main-menu">
                      <MainMenu setConnect={() => setConnect()}/>
                    </div>
                  </div>
                </Col>
                <Col xs="2" className="text-right justify-content-center">
                  <div onClick={()=>mobileNavSet(true)} className="mobile-menu-area">
                    <div className="mobileMenuLine">
                      <span className="menuLine"></span>
                      <span className="menuLine"></span>
                      <span className="menuLine"></span>
                    </div>
                    
                  </div>
                </Col>
            </Row>
          </Container>
          
        </div>
        <div className={mobileNav ? 'mobile-menu-assets active d-md-none' : 'mobile-menu-assets d-md-none'}>
          <div className="close-btn" onClick={()=> mobileNavSet(false)}>
            <FaTimes />
          </div>
            <MainMenu setConnect={() => setConnect()}/>
        </div>

        <div className={search ? 'mobile-search active d-md-none' : 'mobile-search d-md-none' }>
          <div className="search-close" onClick={()=> searchSet(false)}>
            <FaTimes />
          </div>
          <Form>
              <Form.Group controlId="search">
                
                <Form.Control type="Search" placeholder="Search" />
                
              </Form.Group>
            </Form>
          </div>
    </>
  )
}

export default Header
