This is a node.js implementation of a server which does 3 services:

1. provides conversion rate between 2 currencies. Example:
http://localhost:3000/paypal/conversionRate?from=USD&to=JPY&live=true
"from" and "to" fields are required and have to be equal to a 3-letter currency abbreviation.
"live" is optional and defaulted to false. If false, the cached rate will be returned if 
available and live fetch will be made otherwise.

2. provides currency conversion calculator. Example:
http://localhost:3000/paypal/currencyConversion?from=USD&to=JPY&live=true&amount=10
Same as above and "amount" is required on top of the above.

3. provides the transactions history 
http://localhost:3000/paypal/activity?cur=INR
"cur" field is optional. By default all amounts are shown in USD. 
User can pick the displayed currency from the dropdown box on the htlm page.