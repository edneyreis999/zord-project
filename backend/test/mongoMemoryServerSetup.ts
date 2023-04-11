import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const setupMongoMemoryServer = async () => {
  mongod = await MongoMemoryServer.create();
  return mongod;
};
