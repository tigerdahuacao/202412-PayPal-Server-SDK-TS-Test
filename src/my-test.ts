import { OrderAPI } from './api/orderAPI'
import { PaymentAPI } from './api/paymentAPI'
let orderID: string;
let captureID: string;
let authID: string

const orderAPI = new OrderAPI();
const paymentAPI = new PaymentAPI();

const print = (obj: any, name?: string) => {
    if (obj instanceof Object) {
        if (name) {
            console.log(`=======================${name}=======================`, '\r\n:\r\n', JSON.stringify(obj, null, "  "))
        } else {

            console.log(JSON.stringify(obj, null, "  "))
        }
    } else if (typeof obj === 'string') {
        console.log(`=======================${name}=======================`, '\r\n:\r\n', obj)
    }
}

// 测试order API
// const main = async () => {
//     const returnObj = await orderAPI.createOrder();
//     orderID = returnObj.orderID;
//     // let { httpResponse } = returnObj;

//     // print(httpResponse)   
//     print(orderID, 'orderID');

//     await orderAPI.patchOrder(orderID);
//     await orderAPI.confirmPaymentSource(orderID)

//     const obj1 = await orderAPI.captureOrder(orderID);
//     captureID = obj1.captureID
//     print(captureID, 'captureID');

//     const { trackerID } = await orderAPI.ordersTrackCreate(orderID, captureID);
//     print(trackerID, 'trackerID')
//     const obj2 = await orderAPI.ordersTrackersPatch(orderID,trackerID);
//     print(obj2?.statusCode)

// }


// 创建一个授权, 并且扣钱
const main = async () => {

    const returnObj = await orderAPI.createAuthorization();
    orderID = returnObj.orderID;
    let { httpResponse } = returnObj;

    await orderAPI.confirmPaymentSource(orderID)

    let { authID }: any = await orderAPI.orderAuthorize(orderID);
    let result: any;

    print(authID, 'authID');


    const returnObj4 = await paymentAPI.authorizationGet(authID);
    print(returnObj4.result)

    const returnObj5 = await paymentAPI.authorizationsCapture(authID);
    const authCaptureID = returnObj5!.authCaptureID!
    print(returnObj5!.result, 'authorizationsCapture');

    const authCaptureGet = await paymentAPI.captureGet(authCaptureID)
    const authCaptureGetResult = authCaptureGet.result
    print(authCaptureGetResult,'authCaptureGet') 

    // const returnObj6 = await paymentAPI.authorizationGet(authID);
    // print(returnObj6.result,'新的Auth Get')

    // const returnObj7 = await paymentAPI.reAuthorize(authID);
    // print(returnObj7!.result,'reAuthorize')

    // const returnObj8 = await paymentAPI.authorizationGet(authID);
    // print(returnObj8.result, '新的Auth Get')


    const returnObj9 = await paymentAPI.captureRefund(authCaptureID)
    const refundId = returnObj9.refundId!
    print(returnObj9.result,'authCapture Refund') 

    const returnObj10 = await paymentAPI.refundGet(refundId);
    print(returnObj10.result,'refund Detail')
}

// 创建一个授权, 并取消
// const main = async () => {

//     const returnObj = await orderAPI.createAuthorization();
//     orderID = returnObj.orderID;
//     let { httpResponse } = returnObj;

//     await orderAPI.confirmPaymentSource(orderID)

//     let { authID }: any = await orderAPI.orderAuthorize(orderID);
//     let result: any;

//     print(authID, 'authID');


//     const returnObj4 = await paymentAPI.authorizationGet(authID);
//     print(returnObj4.result)

//     const returnObj5 = await paymentAPI.cancelAuthorize(authID)
//     print(returnObj4.result, 'cancelAuthorize')

//     //尝试取消后再扣款
//     const returnObj6 = await paymentAPI.authorizationsCapture(authID);    
//     const authCaptureID = returnObj6!.authCaptureID!
//     print(returnObj5.result, 'authorizationsCapture');


// }





main();