import { ApiError, CheckoutPaymentIntent, OrdersController, PatchOp, PaymentsController, ShipmentCarrier } from "@paypal/paypal-server-sdk";
import { RequestOptions } from "http";
import { ServerClient } from "./serverClient";
import { ProcessingInstruction } from '@paypal/paypal-server-sdk';



export class OrderAPI {
    private ordersController: OrdersController;

    constructor() {
        this.ordersController = new OrdersController(ServerClient.getClient());
    }

    public async createOrder(intent: CheckoutPaymentIntent = CheckoutPaymentIntent.Capture) {
        const requestOptions: RequestOptions = {

        }
        const requestBody = {
            paypalPartnerAttributionId: ServerClient.getBNCODE(),
            requestOptions: requestOptions,
            body: {
                intent: intent === CheckoutPaymentIntent.Capture ? CheckoutPaymentIntent.Capture : CheckoutPaymentIntent.Authorize,
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: 'USD',
                            value: '100',
                        },
                    }
                ],
                attributes: {
                    "verification": {
                        "method": "SCA_WHEN_REQUIRED",
                        "_comment": "SCA_ALWAYS to force otherwise use SCA_WHEN_REQUIRED"
                    },
                }
            },
            prefer: 'return=minimal'
        }

        const { result, ...httpResponse } = await this.ordersController.ordersCreate(requestBody);

        // console.log('Create order HTTP response code:', httpResponse.statusCode)

        const orderID = result.id ?? "";
        // console.log("Create Order ID:", orderID)

        return {
            orderID,
            httpResponse
        };
    }

    public async createAuthorization() {
        const requestOptions: RequestOptions = {

        }
        const requestBody = {
            paypalPartnerAttributionId: ServerClient.getBNCODE(),
            requestOptions: requestOptions,
            body: {
                intent: CheckoutPaymentIntent.Authorize,
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: 'USD',
                            value: '100',
                        },
                    }
                ],
            },
            prefer: 'return=minimal'
        }

        const { result, ...httpResponse } = await this.ordersController.ordersCreate(requestBody);
        // console.log('Create order HTTP response code:', httpResponse.statusCode)

        const orderID = result.id ?? "";
        // console.log("Create Order ID:", orderID)

        return {
            orderID,
            result,
            httpResponse
        };
    }

    public async orderAuthorize(orderID: string) {

        const requestBody = {
            paypalPartnerAttributionId: ServerClient.getBNCODE(),

            id: orderID,
            prefer: 'return=minimal'
        }

        let result_obj;
        let httpResponse_obj;
        let authID: string | undefined = '';

        try {
            const { result, ...httpResponse } = await this.ordersController.ordersAuthorize(requestBody);
            result_obj = result;
            httpResponse_obj = httpResponse;

            authID = result.purchaseUnits?.[0].payments?.authorizations?.[0].id ?? 'id0';

        } catch (error) {
            if (error instanceof ApiError) {
                const errors = error.result;
                console.log(JSON.stringify(errors, null, '  '))
            }
        }
        console.log("=======================Order Authorize=======================")
        console.log(JSON.stringify(result_obj, null, '  '))




        return {
            authID: authID,
            result: result_obj,
            httpResponse: httpResponse_obj
        };
    }




    public async patchOrder(orderID: string) {

        const collect = {
            id: orderID,
            body: [
                {
                    op: PatchOp.Replace,
                    path: "/purchase_units/@reference_id=='default'/amount",
                    value: {
                        currency_code: 'USD',
                        value: '102',
                    }

                }
            ]
        }

        const { result, ...httpResponse } = await this.ordersController.ordersPatch(collect);
        // console.log(JSON.stringify(result, null, '  '))
        // console.log(JSON.stringify(httpResponse, null, '  '))

        console.log(JSON.stringify(result, null, '  '))
        console.log(JSON.stringify(httpResponse, null, '  '))

        return {
            result,
            statusCode: httpResponse.statusCode
        };
    }


    public async getOrder(orderID: string) {

        const collect = {
            id: orderID,

        }

        const { result, ...httpResponse } = await this.ordersController.ordersGet(collect);
        // console.log(JSON.stringify(result, null, '  '))
        // console.log(JSON.stringify(httpResponse, null, '  '))

        console.log(JSON.stringify(result, null, '  '))
        console.log(JSON.stringify(httpResponse, null, '  '))

        return {
            result,
            statusCode: httpResponse.statusCode
        };
    }

    public async confirmPaymentSource(orderID: string) {

        const collect = {
            id: orderID,
            prefer: 'return=minimal',
            body: {
                paymentSource: {
                    "card": {
                        "number": "5200000000001005",
                        "security_code": "123",
                        "expiry": "2027-12"
                    }
                },
                processingInstruction: ProcessingInstruction.NoInstruction,
            }
        }


        const { result, ...httpResponse } = await this.ordersController.ordersConfirm(collect);
        console.log("=======================Order Confirm=======================")
        console.log(JSON.stringify(result, null, '  '))


        return {
            result,
            statusCode: httpResponse.statusCode
        };
    }

    // public getAuthorizeIDfromResultBody = (result:any)=>{

    // }

    public async captureOrder(orderID: string) {
        const collect = {
            id: orderID,
            prefer: 'return=minimal'
        }

        const { result, ...httpResponse } = await this.ordersController.ordersCapture(collect);

        const captureID = result.purchaseUnits?.[0].payments?.captures?.[0].id ?? 'id0';
        console.log(httpResponse.headers["paypal-debug-id"])
        return {
            result,
            captureID,
            httpResponse
        };
    }

    public async ordersTrackCreate(orderID: string, captureID: string) {
        const collect = {
            id: orderID,
            body: {
                captureId: captureID,
                notifyPayer: false,
                "trackingNumber": "ABC12304",
                "carrier": ShipmentCarrier.Usps
            }
        }

        const { result, ...httpResponse } = await this.ordersController.ordersTrackCreate(collect);
        console.log('paypal-debug-id', httpResponse.headers["paypal-debug-id"])

        const trackerID = result.purchaseUnits?.[0].shipping?.trackers?.[0].id ?? 'id0';
        return {
            result,
            trackerID,
            statusCode: httpResponse.statusCode,
            httpResponse
        };
    }

    public async ordersTrackersPatch(orderID: string, trackerID: string) {
        // const captureID = trackerID.split('-')[0];
        // const trackerId = trackerID.split('-')[1];

        const collect = {
            id: orderID,
            trackerId: trackerID,
            body: [
                // {
                //     op: PatchOp.Replace,
                //     path: 'carrier',
                //     value: ShipmentCarrier.Apg
                // }
                {
                    "op": PatchOp.Replace,
                    "path": "/notify_payer",
                    "value": true
                }
            ]
        }

        try {
            const { result, ...httpResponse } = await this.ordersController.ordersTrackersPatch(collect);
            console.log(httpResponse.headers["paypal-debug-id"]);
            return {
                result,
                statusCode: httpResponse.statusCode,
                httpResponse
            };
        } catch (error) {
            if (error instanceof ApiError) {
                const errors = error.result;
                // const { statusCode, headers } = error;
                console.log(JSON.stringify(errors, null, '  '))
            }
        }
    }
}


