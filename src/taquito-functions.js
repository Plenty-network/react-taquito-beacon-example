import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
const rpcNode = 'https://mainnet.smartpy.io/';

// This function fetches plenty balance of any address for you.
export const fetchPlentyBalanceOfUser = async (userAddress) => {
  try {
    const Tezos = new TezosToolkit(rpcNode);
    Tezos.setProvider(rpcNode);
    const plentyContractAddress = 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b';
    let userBalance = 0;
    const plentyTokenDecimal = 18;
    const plentyContractInstance = await Tezos.contract.at(
      plentyContractAddress
    );
    const storageInstance = await plentyContractInstance.storage();
    const userDetails = await storageInstance.balances.get(userAddress);
    userBalance = userDetails.balance;
    userBalance =
      userBalance.toNumber() / Math.pow(10, plentyTokenDecimal).toFixed(3);
    return {
      success: true,
      userBalance,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      userBalance: 0,
    };
  }
};

// This function checks if the wallet is connected with app to perform any operation.

const CheckIfWalletConnected = async (wallet) => {
  try {
    const network = {
      type: 'mainnet',
    };
    const activeAccount = await wallet.client.getActiveAccount();
    if (!activeAccount) {
      await wallet.client.requestPermissions({
        network,
      });
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

// This function helps you transfer plenty from you account to other account.

export const transferPlenty = async (amount, payerAddress) => {
  try {
    const options = {
      name: 'Test App',
    };

    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet);

    if (WALLET_RESP.success) {
      const account = await wallet.client.getActiveAccount();
      const userAddress = account.address;
      const Tezos = new TezosToolkit(rpcNode);
      Tezos.setRpcProvider(rpcNode);
      Tezos.setWalletProvider(wallet);
      const plentyContractAddress = 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b';
      const plentyTokenDecimal = 18;
      const plentyContractInstance = await Tezos.contract.at(
        plentyContractAddress
      );
      const transferAmount = Math.floor(
        amount * Math.pow(10, plentyTokenDecimal)
      );
      let batch = null;
      batch = await Tezos.wallet
        .batch()
        .withContractCall(
          plentyContractInstance.methods.transfer(
            userAddress,
            payerAddress,
            transferAmount
          )
        );
      const batchOperation = await batch.send();
      await batchOperation.confirmation();
      return {
        success: true,
        opID: batchOperation.opHash,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      opID: null,
    };
  }
};
