const omise = require('omise');

export class PaymentCharger {
    private static readonly OMISE_SECRET_KEY_TEST: string = "skey_test_5dbjn3qm3bpvxybdf2n";
    private static readonly OMISE_PUBLIC_KEY_TEST: string = "pkey_test_5dbjn3qlv235d8qswgs";
    
    private static readonly OMISE_SECRET_KEY_LIVE: string = "skey_5dudx2wtbrjwyfjc56n";
    private static readonly OMISE_PUBLIC_KEY_LIVE: string = "pkey_5duczv2mn9zaa28z2u6";

    private static mPaymentCharger: PaymentCharger;

    private static readonly IS_DEV: boolean = false;

    public static getInstance() {
        if (!PaymentCharger.mPaymentCharger) PaymentCharger.mPaymentCharger = new PaymentCharger();
        return PaymentCharger.mPaymentCharger;
    }

    public static omiseStatic = omise({
        'publicKey': (PaymentCharger.IS_DEV ? PaymentCharger.OMISE_PUBLIC_KEY_TEST : PaymentCharger.OMISE_PUBLIC_KEY_LIVE),
        'secretKey': (PaymentCharger.IS_DEV ? PaymentCharger.OMISE_SECRET_KEY_TEST : PaymentCharger.OMISE_SECRET_KEY_LIVE)
    });

    public getKey(IS_DEV: boolean) {
        if (IS_DEV) {
            return {
                publicKey: PaymentCharger.OMISE_PUBLIC_KEY_TEST,
                secretKey: PaymentCharger.OMISE_SECRET_KEY_TEST
            }
        } else {
            return {
                publicKey: PaymentCharger.OMISE_PUBLIC_KEY_LIVE,
                secretKey: PaymentCharger.OMISE_SECRET_KEY_LIVE
            }
        }
    }

    public chargeCard(amount: Number, description: string, cardToken: string, returnURI: string) {
        return PaymentCharger.omiseStatic.charges.create({
            amount: amount,
            currency: 'thb',
            return_uri: returnURI,
            description: description,
            card: cardToken
        });
    }

    public chargeInternetBanking(amount: Number, description: string, sourceID: string, returnURI: string) {
        return PaymentCharger.omiseStatic.charges.create({
            amount: amount,
            currency: 'thb',
            return_uri: returnURI,
            description: description,
            source: sourceID
        })
    }

}