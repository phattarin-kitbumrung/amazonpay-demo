const fs = require('fs')
const uuidv4 = require('uuid/v4')
const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs')

const config = {
    publicKeyId: 'AFJPZIKODGQMUOOTWWROW2R4',
    privateKey: fs.readFileSync('amazonpay.pem'),
    region: 'jp',
    sandbox: true
}

let testPayClient = new Client.AmazonPayClient(config)
let payload = {
    "signInReturnUrl":"https://www.google.co.th/",
    "storeId":"amzn1.application-oa2-client.1ea5f3a479854050a887031ef6a73b78",
    "signInScopes":["name", "email", "postalCode", "shippingAddress", "phoneNumber"]
}
let signature = testPayClient.generateButtonSignature(payload)
console.log(signature)


testPayClient = new Client.AmazonPayClient(config);
payload = {
    "webCheckoutDetails": {
        "checkoutReviewReturnUrl": "https://t-web-93913.firebaseapp.com/"
    },
    "storeId":"amzn1.application-oa2-client.1ea5f3a479854050a887031ef6a73b78",
    "scopes": ["name", "email", "phoneNumber", "billingAddress"],
    "deliverySpecifications": {
        "specialRestrictions": ["RestrictPOBoxes"],
        "addressRestrictions": {
            "type": "Allowed",
            "restrictions": {
                "US": {
                    "statesOrRegions": ["WA"],
                    "zipCodes": ["95050", "93405"]
                },
                "GB": {
                    "zipCodes": ["72046", "72047"]
                },
                "IN": {
                    "statesOrRegions": ["AP"]
                },
                "JP": {}
            }
        }
    }
} 
signature = testPayClient.generateButtonSignature(payload);
console.log(signature);

/**  Checkout v2 - Create Checkout Session **/
payload = {
    webCheckoutDetails: {
        checkoutReviewReturnUrl: 'https://localhost/store/checkoutReview',
        checkoutResultReturnUrl: 'https://localhost/store/checkoutReturn'
    },
    storeId: 'amzn1.application-oa2-client.1ea5f3a479854050a887031ef6a73b78' // Enter Client ID
}
let headers = {
    'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
}

testPayClient = new Client.WebStoreClient(config);
testPayClient.createCheckoutSession(payload, headers).then((apiResponse) => {
    const response = apiResponse
    console.log(response.data)
})

/**  Checkout v2 - Update Checkout Session **/
payload = {
    webCheckoutDetails: {
        checkoutResultReturnUrl: 'https://localhost/store/checkoutReturn'
    },
    paymentDetails: {
        paymentIntent: 'AuthorizeWithCapture',
        canHandlePendingAuthorization: false,
        chargeAmount: {
            amount: 50,
            currencyCode: 'JPY'
        }
    },
    merchantMetadata: {
        merchantReferenceId: uuidv4().toString().replace(/-/g, ''),
        merchantStoreName: 'AmazonTestStoreFront',
        noteToBuyer: 'merchantNoteForBuyer',
        customInformation: ''
    }
}

let checkoutSessionId = 'f7a34429-f210-4030-b764-d896da27cc75'
testPayClient = new Client.WebStoreClient(config)
testPayClient.updateCheckoutSession(checkoutSessionId, payload).then((apiResponse) => {
    const response = apiResponse
    console.log(response.data)
})

/**  Checkout v2 - Complete Checkout Session **/
payload = {
    "chargeAmount": {
        "amount": "50",
        "currencyCode": "JPY"
    }
}
headers = {
    'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
}

checkoutSessionId = 'f7a34429-f210-4030-b764-d896da27cc75'
testPayClient = new Client.WebStoreClient(config)
testPayClient.completeCheckoutSession(checkoutSessionId, payload, headers).then((apiResponse) => {
    const response = apiResponse
    console.log(response.data)
})
