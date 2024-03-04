import { useState, useEffect } from "react"
import styled from 'styled-components';
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
  color: black;
  background-color: #15E7B6;
  font-size: 20px;
  padding: 2px 10px 2px 10px;
  border-radius: 20%;
  position: relative; // This enables absolute positioning for children
`;

const Tooltip = styled.div`
  position: absolute;
  right: 50%; // Adjust this value to control the tooltip position
  top: 100%;
  visibility: hidden;
  width: 400px; // Adjust based on the size of your tooltip
  background-color: black;
  color: white;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  // Hide the tooltip by default and only show it when the InfoIcon is hovered
  ${InfoIcon}:hover & {
    visibility: visible;
    font-size: 14px;
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
            setSeiPriceInfo({
              price: `$${current_price.toFixed(2)}`,
              priceChangePercentage: price_change_percentage_24h,
            });
          } else {
            setSeiPriceInfo({ ...seiPriceInfo, price: 'Unavailable' });
          }
        } catch (error) {
          console.error("Failed to fetch SEI price:", error);
          setSeiPriceInfo({ ...seiPriceInfo, price: 'Failed to load' });
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
        <img src="https://storage.googleapis.com/cryptomonos/monos/sei_logo.png" alt="SEI Token" style={{ marginRight: '10px', width: '28px', height: '28px', marginBottom: '2px' }} />
        <span>{seiPriceInfo.price}</span>
        <span style={{ marginLeft: '5px', color: priceChangeColor }}>
          {arrowDirection} {Math.abs(seiPriceInfo.priceChangePercentage).toFixed(2)}%
        </span>
      </div>
    );
};

const Home = () => {
    const { openWalletConnect, wallet, disconnectWallet } = useWalletConnect();
    const [balance] = useState('');
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
        }
    }, [selectedCollectionSlug]);

    const resetToLeaderboard = () => {
        setSelectedCollectionSlug(''); // Reset the selected collection slug
        setShowLeaderboard(true); // Ensure the leaderboard is shown again
    };

    const cleanSlug = (slug: string): string => {
        return slug.toLowerCase().replace(/[^a-z_]/g, '');
    };

    return (
        <C.Home>
            <C.Container>
                <C.Header>
                    <C.Logo src="/images/logo.png" onClick={resetToLeaderboard} style={{cursor: 'pointer'}} />
                    <SEIPriceTicker />
                    <ConnectWalletButtonContainer>
                    <InfoIcon>
                        ℹ️ {/* You can replace this with an SVG or an image for the info icon */}
                        <Tooltip>
                        <p><u>Welcome to SeiTa.co</u></p>
                        <p>SEI PFP Collections Ranked by Floor Price</p>
                        <p>Click on a collection to view more data</p>
                        <p>Sales = 24HR Sales</p>
                        <p>Volume = 24HR Volume</p>
                        <p>Listed = Current Pallet Listings</p>
                        <p>Floor = Current Pallet Floor</p>
                        <p>% Change = 24HR Floor Change</p>
                        </Tooltip>
                    </InfoIcon>
                    {wallet === null ? (
                        <C.WalletConnect onClick={openWalletConnect}>Connect Wallet</C.WalletConnect>
                    ) : (
                        <>
                            <Wallet
                                balance={balance + " SEI"}
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
    );

}

export default Home