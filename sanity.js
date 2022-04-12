import { createCurrentUserHook, createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";

const ID = "9b3see4t"

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ID,
  apiVersion: "2021-03-25",
  useCdn: process.env.NODE_ENV === "production",
}

export const sanityClient = createClient(config)

export const urlFor = (source) => createImageUrlBuilder(config).image(source)