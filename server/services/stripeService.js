// emailing services
// const sendGridEmailing = require('../services/sendGrid').EmailService;
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);

exports.stripeService = {
  createConnectedAccount: async (userVerificationDetails, callback) => {
    try {
      const account = await stripe.accounts.create({
        country: 'CA', //HARD CODED
        type: 'custom', //HARD CODED
        email: 'someEmail@gmail.com',
        default_currency: 'CAD', //HARD CODED
        metadata: { bidorboo_user_id: 'the user id from our app to reference this person' },
        payout_statement_descriptor: 'BidOrBoo Fee', //HARD CODED
        tos_acceptance: {
          date: Math.floor(Date.now() / 1000), //HARD CODED
          ip: req.connection.remoteAddress, //HARD CODED
        },
        legal_entity: {
          address: {
            city: 'Ottawa',
            country: 'CA', //HARD CODED
            line1: '264 testing pvt', //street adress
            postal_code: 'K1s 2p9',
            state: 'ON', // province
          },
          dob: {
            day: '12',
            month: '12',
            year: '1986',
          },
          first_name: 'Contractor bob',
          last_name: 'Test',
          personal_address: {
            //optional
            city: 'Ottawa',
            country: 'CA',
            line1: '264 testing pvt',
            postal_code: 'K1s 2p9',
            state: 'ON',
          },
          phone_number: '613-123-1234',
          verification: {
            document: '',
          },
          type: 'individual', //HARD CODED
        },

        external_account: 'some token from client side',
        // {
        //   // id: 'ba_1DXbEhIkbQJUBZs8mJEXMzBv',
        //   // object: 'bank_account',
        //   // account_holder_name: 'Jane Austen',
        //   // account_holder_type: 'individual',
        //   // bank_name: 'STRIPE TEST BANK',
        //   // country: 'CA',
        //   // currency: 'CAD',
        //   // last4: '6789',
        //   // routing_number: '11000000',
        //   // status: 'new',
        //   // account_number: '000123456789',
        //   // metadata: {}, // keyvalue pair to represent what exactly is going on
        // },
      });
      // will return something like this
      // {
      //   ...
      //   "id": "acct_12QkqYGSOD4VcegJ",  <--- you wana store this in your DB
      //   "keys": {
      //     "secret": "sk_live_AxSI9q6ieYWjGIeRbURf6EG0",
      //     "publishable": "pk_live_h9xguYGf2GcfytemKs5tHrtg"
      //   },
      //   "type": "custom"
      //   ...
      // }
      return account;
    } catch (error) {
      throw error;
    }
  },
};
