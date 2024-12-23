import { describe, expect, test } from '@jest/globals';
import { ProcessingInstruction, ApiError, CheckoutPaymentIntent, Client, Environment, LinkHttpMethod, LogLevel, OrdersController, PatchOp, ShipmentCarrier } from '@paypal/paypal-server-sdk';
import { ClientInterface } from '@paypal/paypal-server-sdk/dist/types/clientInterface';
import { RequestOptions } from '@paypal/paypal-server-sdk/dist/types/core';
import { OrderAPI } from '../api/orderAPI';

const SECONDS = 1000;

let client: ClientInterface;



/**
 * Create Order reference: https://github.com/paypal/PayPal-TypeScript-Server-SDK/blob/0.6.0/doc/controllers/orders.md
 * 测试Create=>Patch=>Capture
 */
describe('[Order Test 1]Create=>Patch=>Capture', () => {

    let orderID: any;
    const orderAPI = new OrderAPI();

    test('[1]ordersCreate', async () => {

        const returnObj = await orderAPI.createOrder();
        orderID = returnObj.orderID;
        const httpResponse = returnObj.httpResponse

        expect(httpResponse.statusCode.toString()).toMatch(/2\d\d/)


    }, 8 * SECONDS);

    test('[2]ordersPatch', async () => {
        console.log('[Test1]ordersPatch', orderID)

        const { statusCode } = await orderAPI.patchOrder(orderID);
        expect(statusCode.toString()).toMatch(/2\d\d/)


    }, 8 * SECONDS);

    test('[3]ordersGet', async () => {

        const { statusCode } = await orderAPI.getOrder(orderID);
        expect(statusCode.toString()).toMatch(/2\d\d/)


    }, 8 * SECONDS);

})



/**
 * Create Order reference: https://github.com/paypal/PayPal-TypeScript-Server-SDK/blob/0.6.0/doc/controllers/orders.md
 * 测试Create=>Capture,
 */
describe('[Order Test 2]Create=>Web Approve=>Capture', () => {


    let orderID: any;
    const orderAPI = new OrderAPI();

    test('[1]ordersCreate', async () => {

        const returnObj = await orderAPI.createOrder();
        orderID = returnObj.orderID;
        const httpResponse = returnObj.httpResponse

        expect(httpResponse.statusCode.toString()).toMatch(/2\d\d/)


    }, 8 * SECONDS);


    /**
     * CaptureOrder需要buyer Approve
     */
    // test('[2]ordersCapture', async () => {
    //     const ordersController = new OrdersController(client);

    //     // orderID = '45E99272GK219103F'
    //     const orderID = 'id0'
    //     const collect = {
    //         id: orderID,
    //         prefer: 'return=minimal'
    //     }


    //     const { result, ...httpResponse } = await ordersController.ordersCapture(collect);
    //     console.log(JSON.stringify(result, null, '  '))
    //     // console.log(JSON.stringify(httpResponse, null, '  '))


    //     // expect(httpResponse.statusCode).toBe(201)


    // }, 8 * SECONDS);

})



/**
 * Create Order reference: https://github.com/paypal/PayPal-TypeScript-Server-SDK/blob/0.6.0/doc/controllers/orders.md
 * 测试Create=>Capture,
 */
describe('[Order Test 3]Card: Create=>Confirm=>Capture=>AddTrack=>PatchTrack', () => {

    let orderID: string;
    let captureID: string;
    let trackerID: string


    const orderAPI = new OrderAPI();

    test('[1]ordersCreate', async () => {
        const returnObj = await orderAPI.createOrder();
        orderID = returnObj.orderID;
        const { httpResponse } = returnObj

        expect(httpResponse.statusCode.toString()).toMatch(/2\d\d/)

    }, 8 * SECONDS);

    test('[2]confirmPaymentSource', async () => {

        const { statusCode } = await orderAPI.confirmPaymentSource(orderID)
        expect(statusCode.toString()).toMatch(/2\d\d/)


    }, 8 * SECONDS);

    test('[3]ordersCapture', async () => {
        console.log('[Server SDK OrderController Test 3][3]ordersCapture')

        const returnObj = await orderAPI.captureOrder(orderID);
        const { httpResponse } = returnObj
        captureID = returnObj.captureID
        expect(httpResponse.statusCode.toString()).toMatch(/2\d\d/)


    }, 8 * SECONDS);

    test('[4]ordersTrackerCreate', async () => {
        console.log('[Server SDK OrderController Test 3][4]order Tracker Create')


        const obj = await orderAPI.ordersTrackCreate(orderID, captureID);
        const { statusCode } = obj;
        trackerID = obj.trackerID
        expect(statusCode.toString()).toMatch(/2\d\d/)

    }, 8 * SECONDS);


    test('[5]Tracker information Patch', async () => {
        console.log('[Server SDK OrderController Test 3][5]Orders Trackers Patch')

        const obj2 = await orderAPI.ordersTrackersPatch(orderID, trackerID);
        expect(obj2?.statusCode.toString()).toMatch(/2\d\d/)

    }, 8 * SECONDS);

})

