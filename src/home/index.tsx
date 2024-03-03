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

const DetailsAndChartContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px; // Adjust the gap as needed

  @media (max-width: 768px) { // Adjust breakpoint as needed
    flex-direction: column;
  }
`;

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
                      message="Buy a CryptoMonos for Access "
                      imageUrl="https://storage.googleapis.com/cryptomonos/monos/logo_him_bg.png"
                      buttonUrl="https://beta.mrkt.exchange/collection/sei1u2nd0rrqhmfpj64rqle8cnlh63nccym5tq4auqvn6ujhyh5ztunsdv8kxl"
                    />
                )}
            </C.Container>
        </C.Home>
    );

}

export default Home