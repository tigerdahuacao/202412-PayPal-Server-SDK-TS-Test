import { Client, Environment, LogLevel } from '@paypal/paypal-server-sdk';
import { ClientInterface } from '@paypal/paypal-server-sdk/dist/types/clientInterface';


// US client
const clientID =
    "AaB-X2CM2jf9k-DU-sWSaNbpfKnHeRLHa84MppXHdBpv36uWUqGui9ldOk6SeET9Os5Hc4J5puUTetXo";
const secretKey =
    "EAwyCjl9UrSmRqV4h6E_xoZdt3CVdJof6P9_1c8IY-jUca_m7g9oCAuMiw5vJ-MyhJzopPiRwbTaqUYy";

const OAuthClientId = clientID;
const OAuthClientSecret = secretKey;

const testBNCode = 'Test-BNCODE'

export class ServerClient {
    private static instance: ServerClient;
    private static BNCODE:string = testBNCode;
    private client: ClientInterface;

    private constructor() {
        
        this.client = new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: OAuthClientId,
                oAuthClientSecret: OAuthClientSecret
            },
            timeout: 0,
            environment: Environment.Sandbox,
            logging: {
                logLevel: LogLevel.Info,
                logRequest: {
                    logBody: false
                },
                logResponse: {
                    logHeaders: false
                }
            },
        });
    }

    public static getInstance() {
        if (!ServerClient.instance) {
            ServerClient.instance = new ServerClient();
        }

        return ServerClient.instance;
    }

    public static getClient(): ClientInterface {
        return this.getInstance().client;
    }

    public static getBNCODE():string{
        return ServerClient.BNCODE;
    }
}