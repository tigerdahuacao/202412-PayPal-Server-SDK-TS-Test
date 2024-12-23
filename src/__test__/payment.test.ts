import { describe, expect, test } from '@jest/globals';
import { OrderAPI } from '../api/orderAPI';


const SECONDS = 1000;


/**
 * Create Order reference: https://github.com/paypal/PayPal-TypeScript-Server-SDK/blob/0.6.0/doc/controllers/payments.md
 * 测试Create=>Get, 但是Patch出错了
 */
describe('[Payment Test 1]', () => {

    let orderID: any;
    const orderAPI = new OrderAPI();
    let authID: string

    test('[1]Auth Create', async () => {
        const returnObj = await orderAPI.createAuthorization();
        orderID = returnObj.orderID;
        let { result, httpResponse } = returnObj;

        orderID = result.id ?? "";
        expect(httpResponse.statusCode.toString()).toMatch(/2\d\d/)


    }, 8 * SECONDS);

    // test('[2]ordersPatch', async () => {
    //     console.log('[Test1]ordersPatch', orderID)
    //     const ordersController = new OrdersController(client);
    //     //TODO 这里patch的路径, 写法, 看不懂. 是驼峰式, 还是下划线式
    //     const collect = {
    //         id: orderID,
    //         body: [
    //             {
    //                 op: PatchOp.Replace,
    //                 path: "/purchase_units/@reference_id=='default'/amount",
    //                 value: {
    //                     currencyCode: 'USD',
    //                     value: '102',
    //                 }

    //             }
    //         ]
    //     }
    //     const { result, ...httpResponse } = await ordersController.ordersPatch(collect);
    //     console.log(JSON.stringify(result, null, '  '))
    //     console.log(JSON.stringify(httpResponse, null, '  '))

    //     console.log("============================================================================")
    //     console.log("============================================================================")
    //     console.log("============================================================================")
    //     // const { statusCode, headers } = httpResponse;


    // }, 8 * SECONDS);

    // test('[3]ordersGet', async () => {

    //     const ordersController = new OrdersController(client);
    //     const collect = {
    //         id: orderID,

    //     }
    //     const { result, ...httpResponse } = await ordersController.ordersGet(collect);
    //     console.log(JSON.stringify(result, null, '  '))
    //     expect(httpResponse.statusCode.toString()).toMatch(/2\d\d/)


    // }, 8 * SECONDS);

})


