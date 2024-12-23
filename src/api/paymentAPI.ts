import { ApiError, CheckoutPaymentIntent, OrdersController, PatchOp, PaymentsController, ShipmentCarrier } from "@paypal/paypal-server-sdk";
import { RequestOptions } from "http";
import { ServerClient } from "./serverClient";
import { ProcessingInstruction } from '@paypal/paypal-server-sdk';



export class PaymentAPI {

    private paymentsController: PaymentsController;

    constructor() {

        this.paymentsController = new PaymentsController(ServerClient.getClient());
    }





    public async authorizationGet(authorizationId: string) {


        const { result, ...httpResponse } = await this.paymentsController.authorizationsGet(authorizationId);
        return { result, httpResponse }
    }

    public async authorizationsCapture(authorizationId: string) {
        const collect = {
            authorizationId: authorizationId,
            prefer: 'return=minimal',
            finalCapture: false,
            "amount": {
                "value": "10.99",
                "currency_code": "USD"
            },
        }


        // const { result, ...httpResponse } = await this.paymentsController.authorizationsCapture(collect);

        // const authCaptureID = result.id
        // return { result, httpResponse, authCaptureID }




        try {
            const { result, ...httpResponse } = await this.paymentsController.authorizationsCapture(collect);

            const authCaptureID = result.id
            return { result, httpResponse, authCaptureID }

        } catch (error) {
            if (error instanceof ApiError) {
                const errors = error.result;
                console.log(JSON.stringify(errors, null, '  '))
            }
        }

    }

    public async captureGet(captureId: string) {

        const { result, ...httpResponse } = await this.paymentsController.capturesGet(captureId);
        return { result, httpResponse }
    }

    public async captureRefund(captureId: string) {
        const collect = {
            captureId: captureId,
            prefer: 'return=minimal'
        }
        const { result, ...httpResponse } = await this.paymentsController.capturesRefund(collect);
        const refundId = result.id
        return { refundId, result, httpResponse }
    }

    public async refundGet(refundId:string){
       
        const { result, ...httpResponse } = await this.paymentsController.refundsGet(refundId);
        return { result, httpResponse }

    }


    public async cancelAuthorize(authorizationId: string) {
        const collect = {
            authorizationId: authorizationId,
            prefer: 'return=minimal'
        }

        const { result, ...httpResponse } = await this.paymentsController.authorizationsVoid(collect);
        return { result, httpResponse }

    }

    public async reAuthorize(authorizationId: string) {
        const collect = {
            authorizationId: authorizationId,
            prefer: 'return=minimal',
            body: {
                "value": "420.00",
                "currency_code": "USD"
            }
        }
        try {
            const { result, ...httpResponse } = await this.paymentsController.authorizationsVoid(collect);
            return { result, httpResponse }
        } catch (error) {
            if (error instanceof ApiError) {
                console.log("=======================Re-Authorize Error=======================")
                const errors = error.result;
                console.log(JSON.stringify(errors, null, '  '))
            }
        }

    }





}


