import { Client, Databases } from "node-appwrite";

const appwriteClient = new Client();

appwriteClient
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

export const databases = new Databases(appwriteClient);

export { Query, ID } from "node-appwrite";
