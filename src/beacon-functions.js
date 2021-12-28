import { BeaconWallet } from '@taquito/beacon-wallet';

// Connects wallet with APP

export const ConnectWalletAPI = async () => {
  try {
    const network = {
      type: 'hangzhounet',
    };
    const options = {
      name: 'Test App',
    };
    const wallet = new BeaconWallet(options);
    let account = await wallet.client.getActiveAccount();
    if (!account) {
      await wallet.client.requestPermissions({
        network,
      });
      account = await wallet.client.getActiveAccount();
    }

    return {
      success: true,
      wallet: account.address,
    };
  } catch (error) {
    return {
      success: false,
      wallet: null,
      error,
    };
  }
};

// Disconnects wallet with App

export const DisconnectWalletAPI = async () => {
  try {
    const options = {
      name: 'hangzhounet',
    };
    const wallet = new BeaconWallet(options);
    await wallet.disconnect();
    return {
      success: true,
      wallet: null,
    };
  } catch (error) {
    return {
      success: false,
      wallet: null,
      error,
    };
  }
};

// Checks if wallet is already connected and provides connected wallet address

export const FetchWalletAPI = async () => {
  try {
    const options = {
      name: 'Test App',
    };
    const wallet = new BeaconWallet(options);
    let account = await wallet.client.getActiveAccount();
    if (!account) {
      return {
        success: false,
        wallet: null,
      };
    }
    return {
      success: true,
      wallet: account.address,
    };
  } catch (error) {
    return {
      success: false,
      wallet: null,
    };
  }
};
