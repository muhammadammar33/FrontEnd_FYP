import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('<le-elysian-v1>');

export const account = new Account(client);
export { ID } from 'appwrite';
