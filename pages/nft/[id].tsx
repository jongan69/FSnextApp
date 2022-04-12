import React, { useEffect, useState } from "react";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from "@thirdweb-dev/react";
import { GetServerSideProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import { useRouter } from "next/router";
import { BigNumber } from "ethers";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  collection: Collection
}

function NftDropPage({ collection }: Props) {
  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [priceInEth, setPriceInEth] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const nftDrop = useNFTDrop(collection.address)//合约的地址

  // Auth
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();
  // --

  // console.log(address)
  useEffect(() => {
    if (!nftDrop) return;

    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll();
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
    }

    fetchPrice();
  }, [nftDrop])


  useEffect(() => {
    if (!nftDrop) return;

    const fetchNFTDropData = async () => {
      setLoading(true);

      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();

      setClaimedSupply(claimed.length);
      setTotalSupply(total);

      setLoading(false);
    }

    fetchNFTDropData();
  }, [nftDrop])

  const mintNft = () => {
    if (!nftDrop || !address) return;

    const quantity = 1; // how many unique NFTs you want to claim

    setLoading(true);
    const notification = toast.loading("Minting NFT...", {
      style: {
        background: "white",
        color: "green",
        fontWeight: "bolder",
        fontFamily: "Poppins",
        fontSize: "17px",
        padding: "20px",
      }
    })

    nftDrop
      .claimTo(address, quantity)//metamask地址 和数量 
      .then(async (tx) => {
        const receipt = tx[0].receipt // the transaction receipt
        const claimedTokenId = tx[0].id // the id of the NFT claimed
        const claimedNFT = await tx[0].data() // (optional) get the claimed NFT metadata

        toast("HOORAY... You Successfully Minted!", {
          duration: 8000,
          style: {
            background: "green",
            color: "white",
            fontWeight: "bolder",
            fontFamily: "Poppins",
            fontSize: "17px",
            padding: "20px",
          }
        })

        console.log(receipt)
        console.log(claimedTokenId)
        console.log(claimedNFT)
      })
      .catch((err) => {
        console.log(err)
        toast("Whoops... Something went wrong!", {
          style: {
            background: "red",
            color: "white",
            fontWeight: "bolder",
            fontFamily: "Poppins",
            fontSize: "16px",
            padding: "20px",
          }
        })
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(notification);
      })
  }

  const router = useRouter();

  return (
    <div className="flex flex-col h-screen lg:grid lg:grid-cols-10 font-Poppins">
      <Toaster position="top-right" />

      {/* Left */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-600 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-purple-600 rounded-xl">
            <img
              className="object-cover w-44 rounded-xl lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt=""
            />
          </div>
          <div className="p-5 space-y-2 text-center">
            <h1 className="text-4xl text-white">{collection.nftCollectionName}</h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col flex-1 p-5 lg:col-span-6 bg-white">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1
            className="text-xl cursor-pointer w-52 font-extralight sm:w-80"
            onClick={() => router.push("/")}
          >
            Nft Market Place
          </h1>

          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="px-4 py-2 text-xs font-bold text-white duration-200 rounded-full bg-gradient-to-br from-cyan-800 to-rose-600 hover:shadow-md lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? "Sign Out" : "Sign In"}
          </button>
        </header>

        <hr className="my-2 border border-sky-400" />
        {address && (
          <p
            className="text-sm text-center text-green-300"
          >
            You're logged in with wallet {address.substring(0, 5)}...{address.substring(address.length - 5)}</p>)}

        {/* Content */}
        <div className="flex flex-col items-center flex-1 mt-10 space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="object-cover pb-5 w-80 lg:w-40"
            src={urlFor(collection.mainImage).url()}
            alt=""
          />

          <h1 className="text-2xl font-bold lg:text-4xl lg:font-extrabold">
            {collection.title}
          </h1>

          {loading ? (
            <p className="pt-2 text-xl text-green-500 animate-bounce">
              Loading Supply Count...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply} / {totalSupply?.toString()} Nft's claimed
            </p>
          )}

          {loading && (
            <img
              className="object-contain h-40 w-40"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt=""
            />
          )}
        </div>

        {/* Mint Button */}
        <button
          onClick={mintNft}
          disabled={loading || claimedSupply === totalSupply?.toNumber() || !address}
          className="w-full h-16 mt-5 font-bold text-white duration-200 bg-blue-600 rounded-full cursor-pointer hover:shadow-xl hover:opacity-90 disabled:bg-gray-400 disabled:shadow-none disabled:opacity-100"
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>Sold out</>
          ) : !address ? (
            <>Sign in to Mint</>
          ) : (
            <span className="font-bold">Mint Nft ({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default NftDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }`

  const collection = await sanityClient.fetch(query, {
    id: params?.id
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}