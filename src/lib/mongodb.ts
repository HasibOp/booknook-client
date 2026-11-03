import dns from 'node:dns';
import { MongoClient } from 'mongodb';

if (!process.env.VERCEL) {
  const publicDns = ['8.8.8.8', '1.1.1.1'];
  dns.setServers(publicDns);
  dns.promises.setServers(publicDns);
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is missing. Add it to .env.local');
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

export const client = globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== 'production') {
  globalForMongo.mongoClient = client;
}

export const db = client.db(process.env.DB_NAME || 'booknook');
