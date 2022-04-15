import { ethers } from "ethers";
import { createContext, ReactNode, useContext, useState } from "react";
import { getProvider, PhantomProvider } from "../lib/wallets/phantom";

type State = {
  provider?: PhantomProvider;
  chain?: string;
  address?: string;
  connectPhantom: () => void;
  connectMetamask: () => void;
};

type WalletsContextType = State | undefined;
type WalletsProviderProps = { children: ReactNode };

const WalletsContext = createContext<WalletsContextType>(undefined);

export const WalletsProvider = ({ children }: WalletsProviderProps) => {
  const [chain, setChain] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const [address, setAddress] = useState<string>();

  const connectPhantom = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
      setProvider(getProvider());
      try {
        const response = await solana.connect();
        setAddress(response.publicKey.toString());
        setChain("solana");
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      }
    }
  };

  const connectMetamask = async () => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setProvider(signer);
    setAddress(await signer.getAddress());
    setChain("ethereum");
  };

  return (
    <WalletsContext.Provider
      value={{
        provider,
        address,
        chain,
        connectPhantom,
        connectMetamask,
      }}
    >
      {children}
    </WalletsContext.Provider>
  );
};

export const useWallets = () => {
  const context = useContext(WalletsContext);

  if (context === undefined) {
    throw new Error("useWallets must be used within a WalletsProvider");
  }

  return context;
};
