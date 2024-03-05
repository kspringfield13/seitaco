import { useState, useEffect } from "react"
import styled, { createGlobalStyle } from 'styled-components';
import * as C from "./style"
import { useWalletConnect } from "hooks/walletConnect"
import config from "config.json"
import Wallet, { DropdownItem } from "components/wallet"
import { getSigningCosmWasmClient } from "@sei-js/core"
import ChartDataContainer from 'components/data'
import Leaderboard from 'components/leaderboard'
import { CollectionDetailsType, collectionMapping } from 'utils/helpers'
import CollectionDetails from 'components/details';
import WalletStatusDisplay from 'components/display';

const GlobalStyle = createGlobalStyle`
  html, body {
    max-width: 100%;
    overflow-x: hidden;
  }
`;

const MONOS_CONTRACT_PACIFIC_1 = "sei1u2nd0rrqhmfpj64rqle8cnlh63nccym5tq4auqvn6ujhyh5ztunsdv8kxl"

const getMonosContract = (network: string) => {
    if (network === "pacific-1") {
        return MONOS_CONTRACT_PACIFIC_1;
    } else {
        throw new Error("Invalid network");
    }
}

interface SEIPriceResponse {
    'sei-network': {
      usd: number;
    };
}

const InfoIcon = styled.div`
  cursor: pointer;
  color: white;
  font-weight: bold;
  font-size: 30px;
  padding: 2px 2px 2px 2px;
  position: relative;
  @media (max-width: 768px) { // Adjust breakpoint as needed
    font-size: 18px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  left: 120%; // Start by positioning the tooltip's left edge at the center of the InfoIcon
  top: 100%;
  transform: translateX(-50%); // Adjusts the tooltip back to the left by half its width, centering it relative to the InfoIcon
  visibility: hidden;
  width: 640px; // Adjust based on the size of your tooltip
  background-color: #121212;
  color: white;
  text-align: left;
  padding: 5px;
  border-radius: 6px;
  font-size: 14px;
  // Correct the typo from 'left-left' to 'margin-left', if needed. However, it might not be necessary with the transform approach.
  @media (max-width: 768px) { // Adjust breakpoint as needed
    font-size: 10px;
    width: 480px;
  }
  // Hide the tooltip by default and only show it when the InfoIcon is hovered
  ${InfoIcon}:hover & {
    visibility: visible;
  }
`;

const ConnectWalletButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; // Adjust the gap between the info icon and the Connect Wallet button
`;

const DetailsAndChartContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px; // Adjust the gap as needed

  @media (max-width: 768px) { // Adjust breakpoint as needed
    flex-direction: column;
  }
`;

const SEIPriceTicker: React.FC = () => {
    const [seiPriceInfo, setSeiPriceInfo] = useState({
      price: 'Loading...',
      priceChangePercentage: 0,
    });
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=sei-network';
    
    const fetchSEIPrice = async () => {
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data && data.length > 0) {
            const { current_price, price_change_percentage_24h } = data[0];
            const updatedSeiPriceInfo = {
              price: `$${current_price.toFixed(2)}`,
              priceChangePercentage: parseFloat(price_change_percentage_24h.toFixed(1)),
            };
            setSeiPriceInfo(updatedSeiPriceInfo);
            localStorage.setItem('seiPriceInfo', JSON.stringify(updatedSeiPriceInfo)); // Update cache
          }
        } catch (error) {
          console.error("Failed to fetch SEI price:", error);
          // Load from cache if fetch fails
          const cachedData = localStorage.getItem('seiPriceInfo');
          if (cachedData) {
              setSeiPriceInfo(JSON.parse(cachedData));
          } else {
              setSeiPriceInfo(prevState => ({ ...prevState, price: '' }));
          }
        }
    };
  
    useEffect(() => {
      fetchSEIPrice();
      const interval = setInterval(fetchSEIPrice, 60000);
      return () => clearInterval(interval);
    }, []);
  
    const priceChangeColor = seiPriceInfo.priceChangePercentage < 0 ? '#ff4242' : '#00c292'; // red for negative, green for positive
    const arrowDirection = seiPriceInfo.priceChangePercentage < 0 ? '▼' : '▲'; // down arrow for negative, up arrow for positive

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
        <img src="https://storage.googleapis.com/cryptomonos/monos/sei_logo.png" alt="SEI Token" style={{ marginRight: '10px', width: '30px', height: '30px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' , textAlign: 'left' }}>
          <div>{seiPriceInfo.price}</div>
          <div style={{ color: priceChangeColor }}>
            <span>{arrowDirection} {Math.abs(seiPriceInfo.priceChangePercentage).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
};

const Home = () => {
    const { openWalletConnect, wallet, disconnectWallet } = useWalletConnect();
    const [showAccessGranted, setShowAccessGranted] = useState(false);
    const [showAccessDenied, setShowAccessDenied] = useState(false);

    const [isTokenHolder, setIsTokenHolder] = useState<boolean | null>(null);
    const [selectedCollectionSlug, setSelectedCollectionSlug] = useState<string>('');

    const [showLeaderboard, setShowLeaderboard] = useState<boolean>(true);
    const [collectionInfo, setCollectionInfo] = useState<CollectionDetailsType | null>(null);
    const [showWalletStatus, setShowWalletStatus] = useState(true);


    useEffect(() => {
        const checkTokenOwnership = async () => {
            if (!wallet) return;

            try {
                const signer = wallet.offlineSigner;
                const client = await getSigningCosmWasmClient(config.rpc, signer);
                const contractAddress = getMonosContract(config.network);

                const query = {
                    tokens: { owner: wallet.accounts[0].address },
                };

                const result = await client.queryContractSmart(contractAddress, query);
                const isTokenOwner = result.tokens && result.tokens.length > 0;
                setIsTokenHolder(isTokenOwner);
                setShowLeaderboard(isTokenOwner);

                if (isTokenOwner) {
                    setShowAccessGranted(true); // Show the Access Granted message
                    setTimeout(() => {
                        setShowAccessGranted(false); // Hide the message after 10 seconds
                    }, 5000);
                }
                if (!isTokenOwner) {
                    setShowAccessDenied(true); // Show the Access Granted message
                    setTimeout(() => {
                        setShowAccessDenied(false); // Hide the message after 10 seconds
                    }, 5000);
                }
            } catch (error) {
                console.error("Error checking token ownership:", error);
                setIsTokenHolder(false);
            }
        };

        checkTokenOwnership();
    }, [wallet]);

    useEffect(() => {
        if (showAccessGranted) {
          const timer = setTimeout(() => {
            setShowAccessGranted(false);
          }, 3000);
          return () => clearTimeout(timer);
        }
    }, [showAccessGranted]);

    useEffect(() => {
        if (showAccessDenied) {
          const timer = setTimeout(() => {
            setShowAccessDenied(false);
          }, 3000);
          return () => clearTimeout(timer);
        }
    }, [showAccessDenied]);

    // Update the effect to set collection information based on the selected slug
    useEffect(() => {
      if (selectedCollectionSlug) {
          const info = collectionMapping[selectedCollectionSlug];
          setCollectionInfo(info);
  
          // Scroll to the top of the page
          window.scrollTo(0, 0);
      }
    }, [selectedCollectionSlug]);

    const resetToLeaderboard = () => {
      setSelectedCollectionSlug('');
      setShowLeaderboard(true);

      window.scrollTo(0, 0);
  };

    const cleanSlug = (slug: string): string => {
        return slug.toLowerCase().replace(/[^a-z_]/g, '');
    };

    return (
      <>
        <GlobalStyle />
        <C.Home>
            <C.Container>
                <C.Header>
                    <C.Logo src="/images/logo.png" onClick={resetToLeaderboard} style={{cursor: 'pointer'}} />
                    <SEIPriceTicker />
                    <ConnectWalletButtonContainer>
                    {showLeaderboard && (
                      <InfoIcon>
                        ⓘ {/* You can replace this with an SVG or an image for the info icon */}
                        <Tooltip>
                          <p><u>Welcome to SeiTa.co</u></p>
                          <p>SEI PFP Collections Ranked by Floor Price</p>
                          <p>- Click on a collection to view more data</p>
                          <p>- Click the PFP on collection page to buy from MRKT</p>
                          <p>- Data refreshed every 5 minutes</p>
                          <p>*Sales = 24HR Sales</p>
                          <p>*Volume = 24HR Volume</p>
                          <p>*Listed = Current Pallet Listings</p>
                          <p>*Floor = Current Pallet Floor</p>
                          <p>*% Change = 24HR Floor Change</p>
                        </Tooltip>
                      </InfoIcon>
                    )}
                    {wallet === null ? (
                        <C.WalletConnect onClick={openWalletConnect}>Connect</C.WalletConnect>
                    ) : (
                        <>
                            <Wallet
                                address={wallet!.accounts[0].address}
                            >
                                <DropdownItem onClick={() => navigator.clipboard.writeText(wallet!.accounts[0].address)}>Copy Address</DropdownItem>
                                <DropdownItem onClick={() => { disconnectWallet(); openWalletConnect() }}>Change Wallet</DropdownItem>
                                <DropdownItem onClick={disconnectWallet}>Disconnect</DropdownItem>
                            </Wallet>
                        </>
                    )}
                    </ConnectWalletButtonContainer>
                </C.Header>
                {/* Overlay for Access Granted Message */}
                {showAccessGranted && (
                    <C.Overlay>
                    <C.AccessGranted>Access Granted</C.AccessGranted>
                    </C.Overlay>
                )}
                {/* Overlay for Access Denied Message */}
                {showAccessDenied && (
                    <C.Overlay>
                    <C.AccessDenied>Access Denied</C.AccessDenied>
                    </C.Overlay>
                )}
                {/* Conditional rendering for Leaderboard and ChartDataContainer */}
                {wallet && isTokenHolder && showLeaderboard && !selectedCollectionSlug && (
                    <Leaderboard onSelectCollection={(slug) => {
                        const cleanedSlug = cleanSlug(slug);
                        setSelectedCollectionSlug(cleanedSlug);
                        setShowLeaderboard(false); // Hide leaderboard once a collection is selected
                    }} />
                )}
                {wallet && isTokenHolder && selectedCollectionSlug && collectionInfo && (
                    <>
                        <CollectionDetails
                        logoSrc={collectionInfo.logoSrc} // Replace with actual logo source
                        collectionName={collectionInfo.name}
                        supply={collectionInfo.supply}
                        website={collectionInfo.website}
                        twitter={collectionInfo.twitter}
                        discord={collectionInfo.discord}
                        backgroundImageSrc={collectionInfo.backgroundImageSrc}
                        mintDate={collectionInfo.mintDate}
                        mintPrice={collectionInfo.mintPrice}
                        address={collectionInfo.address}
                        />
                        <ChartDataContainer collectionSlug={selectedCollectionSlug} />
                    </>
                )}
                {!wallet && showWalletStatus && (
                    <WalletStatusDisplay
                      message="Buy a CryptoMono for Access "
                      imageUrl="https://storage.googleapis.com/cryptomonos/monos/logo_him_bg.png"
                      buttonUrl="https://beta.mrkt.exchange/collection/sei1u2nd0rrqhmfpj64rqle8cnlh63nccym5tq4auqvn6ujhyh5ztunsdv8kxl"
                    />
                )}
            </C.Container>
        </C.Home>
      </>
    );

}

export default Home