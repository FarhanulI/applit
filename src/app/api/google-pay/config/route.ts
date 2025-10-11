/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/googlepay/config/route.ts
import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_MERCHANT_ID = process.env.PAYPAL_MERCHANT_ID || process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID;

async function generateAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { merchantId } = await request.json();
    const accessToken = await generateAccessToken();

    // Use provided merchantId or fallback to environment variable
    const finalMerchantId = merchantId || PAYPAL_MERCHANT_ID;
    
    if (!finalMerchantId) {
      return NextResponse.json(
        { error: 'Merchant ID is required. Please provide it in the request or set PAYPAL_MERCHANT_ID environment variable.' },
        { status: 400 }
      );
    }

    // Determine the correct GraphQL endpoint based on environment
    const graphqlUrl = PAYPAL_API_BASE.includes('sandbox')
      ? 'https://www.sandbox.paypal.com/graphql?GetGooglePayConfig'
      : 'https://www.paypal.com/graphql?GetGooglePayConfig';

    // Correct GraphQL query structure for PayPal's Google Pay config
    const graphqlQuery = {
      query: `query GetGooglePayConfig($merchantId: [String]!) {
        googlePayConfig(merchantId: $merchantId) {
          allowedPaymentMethods {
            type
            parameters {
              allowedAuthMethods
              allowedCardNetworks
              billingAddressRequired
              billingAddressParameters {
                format
                phoneNumberRequired
              }
            }
            tokenizationSpecification {
              type
              parameters {
                gateway
                gatewayMerchantId
              }
            }
          }
          merchantInfo {
            merchantId
            merchantName
          }
        }
      }`,
      variables: {
        merchantId: [finalMerchantId]
      }
    };

    console.log('Requesting Google Pay config with merchantId:', finalMerchantId);

    // Fetch Google Pay config from PayPal GraphQL
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Client-Id': PAYPAL_CLIENT_ID
      },
      body: JSON.stringify(graphqlQuery)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PayPal GraphQL Error:', errorText);
      return NextResponse.json(
        { 
          error: 'Failed to fetch Google Pay config',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return NextResponse.json(
        { 
          error: 'GraphQL query returned errors',
          details: data.errors
        },
        { status: 400 }
      );
    }

    console.log('Successfully fetched Google Pay config');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching Google Pay config:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Google Pay config',
        message: error.message 
      },
      { status: 500 }
    );
  }
}