import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';

const newPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const merchantTransactionId = 'M' + Date.now();
        const { price, phone, name } = req.body;

        const data = {
            merchantId: 'PGTESTPAYUAT',
            merchantTransactionId: merchantTransactionId,
            merchantUserId: 'PEOEHOT9383BBB',
            name: name,
            amount: price * 100,
            redirectUrl: `http://10.10.2.82:8000/user/payment/checkStatus/${merchantTransactionId}`,
            redirectMode: 'REDIRECT',
            mobileNumber: phone,
            paymentInstrument: {
                type: 'PAY_PAGE',
            },
        };

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = '1';
        const key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
        const string = payloadMain + '/pg/v1/pay' + key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

    const options = {
            method: 'POST',
            // url: "https://api.phonepe.com/apis/hermes/pg/v1/pay", FOR REALTIME PAYMENT
            url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay", //FOR TEST PAYMENT

            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
            },
            data: {
                request: payloadMain,
            },
        };

        axios
            .request(options)
            .then(function (response) {
                console.log((response.data.data.instrumentResponse.redirectInfo.url))
                 res.send(response.data.data.instrumentResponse.redirectInfo.url);
            })
            .catch(function (error) {
                console.error(error);
            });
    } catch (error) {
        res.status(500).send({
            message: (error as Error).message,
            success: false,
        });
    }
};

const checkStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const merchantTransactionId = req.params['txnId'];
        const merchantId = 'PGTESTPAYUAT';
        const keyIndex = "1";
        const key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
        const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const options = {
            method: 'GET',
            url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,//FOR TEST
            // url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`, //FOR REALTIME
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': `${merchantId}`,
            },
        };

        // CHECK PAYMENT STATUS
        axios
            .request(options)
            .then(async (response) => {
                if (response.data.success === true) {
                    console.log(response.data);
                    return res.status(200).send({ success: true, message: 'Payment Success' });
                } else {
                    return res.status(400).send({ success: false, message: 'Payment Failure' });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send({ msg: err.message });
            });
    } catch (error) {
        res.status(500).send({
            message: (error as Error).message,
            success: false,
        });
    }
};

export default { newPayment, checkStatus };
