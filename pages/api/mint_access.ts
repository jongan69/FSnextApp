import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

// This depend on your HTTP Server setup. In this example, we're using next.js
// api handlers.

export default function mint(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {

  // the RPC URL to the blockchain that the NFT contract is deployed on.
  // "rinkeby" = rinkeby testnet,
  // "https://rpc-mumbai.maticvigil.com" = mumbai testnet.
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

  // setup a wallet using private key for the SDK.
  // the wallet must have MINTER role to mint the NFT.
  // you can assign MINTER role to the wallet through the NFT collection dashboard.
  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY as string, // DONT SHARE THIS WITH ANYONE!
    ethers.getDefaultProvider(rpcUrl)
  );

  // initialize the SDK and get the NFT Collection module
  // get the contract address (0x...) from your dashboard!
  const nft = new ThirdwebSDK(wallet).getNFTCollection(
    process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string
  );

  // returning the HTTP response. This depends on the HTTP server framework.
  return new Promise<void>((resolve) => {
    // get the wallet address that's sent in from the request body.
    const { address } = req.body;

    // mint "Collectable" NFT to the wallet address that was requested.
    // note: async / await works too.
    nft
      .mintTo(address, {
        name: "Collectable",
        description: "Collectifi Mobile App NFT Pass",
        image: "ipfs://QmazmFxTySFEP6fbQycZaqA4FwzLvR2cxvvUAaPwNNgH7z",
      })
      .then((metadata) => {
        // Returning the NFT metadata to the client requested.
        // This depends on the HTTP server framework
        const receipt = metadata.receipt; // the transaction receipt
        const tokenId = metadata.id; // the id of the NFT minted
        const nft1 = metadata.data(); // (optional) fetch details of minted NFT
        console.log('MINTING DATA: ', receipt, tokenId, nft1)
        res.status(200).json(metadata);
        resolve();
      });
  });
}