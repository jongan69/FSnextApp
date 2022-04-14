import React, { useEffect, useState } from "react";
import { Button, useToast } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ConnectWalletButton } from "./ConnectWallet";

export const MintAccessButton = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const address = useAddress();
  
  const onMintHandler = async () => {
    toast({
      title: "Minting...",
      status: "info",
      duration: 9000,
      isClosable: true,
    });
    setLoading(true);

    // make a backend server api request to mint an NFT
    await fetch("/api/mint_access", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ address }),
    }).then((response) => {
      setLoading(false);

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Your access has been minted",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    });
  };

  // render the button to mint an access NFT
  return address ? (
    <Button onClick={onMintHandler}>Mint Access</Button>
  ) : (
    <ConnectWalletButton />
  );
};