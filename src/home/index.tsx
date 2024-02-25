import { useState, useEffect } from "react"
import * as C from "./style"
import { useWalletConnect } from "hooks/walletConnect"
import config from "config.json"
import Wallet, { DropdownItem } from "components/wallet"
import { getSigningCosmWasmClient } from "@sei-js/core"
import ChartComponent from 'components/chart';
import StatsContainer from 'components/stats';
import DoubleChart from 'components/doublechart';

const MONOS_CONTRACT_PACIFIC_1 = "sei1u2nd0rrqhmfpj64rqle8cnlh63nccym5tq4auqvn6ujhyh5ztunsdv8kxl"

const getMonosContract = (network: string) => {
    if (network === "pacific-1") {
        return MONOS_CONTRACT_PACIFIC_1;
    } else {
        throw new Error("Invalid network");
    }
}

const Home = () => {
    const { openWalletConnect, wallet, disconnectWallet } = useWalletConnect();
    const [balance] = useState('');
    const [showAccessGranted, setShowAccessGranted] = useState(false);
    const [showAccessDenied, setShowAccessDenied] = useState(false);

    const [isTokenHolder, setIsTokenHolder] = useState<boolean | null>(null);

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
          }, 1000);
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

    return (
        <C.Home>
            <C.Container>
                <C.Header>
                    <C.Logo src="/images/logo.png" />
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
                {/* Include ChartComponent only if the wallet is connected and the user is a token holder */}
                {wallet && isTokenHolder && (
                    <>
                        <StatsContainer /* pass any required props to StatsContainer here */ />
                        <C.ChartsContainer>
                            <C.ChartWrapper>
                                <ChartComponent
                                    apiKey="AIzaSyBOfUsNid2OYs-ChLUw3lNG15GXiKnY59I"
                                    spreadsheetId="1o1jIzmka7PPL_08NBP5x9_7jgUpdJrwXL3_sDflS0ic"
                                    range="Sheet1!A:L"
                                    chartId="floorChart"
                                    chartTitle="Floor Price"
                                    label="Floor Price (SEI)"
                                    dataSet="FloorPrice"
                                />
                            </C.ChartWrapper>
                            <C.ChartWrapper>
                                <ChartComponent
                                    apiKey="AIzaSyBOfUsNid2OYs-ChLUw3lNG15GXiKnY59I"
                                    spreadsheetId="1o1jIzmka7PPL_08NBP5x9_7jgUpdJrwXL3_sDflS0ic"
                                    range="Sheet1!A:L"
                                    chartId="volumeChart"
                                    chartTitle="Volume"
                                    label="Volume (SEI)"
                                    dataSet="Volume"
                                />
                            </C.ChartWrapper>
                        </C.ChartsContainer>
                        <C.ChartsContainerFull>
                            <C.ChartWrapperFull>
                                <DoubleChart
                                apiKey="AIzaSyBOfUsNid2OYs-ChLUw3lNG15GXiKnY59I"
                                spreadsheetId="1o1jIzmka7PPL_08NBP5x9_7jgUpdJrwXL3_sDflS0ic"
                                range="Sheet1!A:N"
                                chartId="doubleChart"
                                // Add any other props you need for DoubleChart
                                />
                            </C.ChartWrapperFull>
                        </C.ChartsContainerFull>
                    </>
                )}
            </C.Container>
        </C.Home>
    );

}

export default Home