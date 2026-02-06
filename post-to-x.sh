#!/bin/bash

# OAuth 1.0a credentials - Get these from X Developer Console > OAuth 1.0 Keys
API_KEY="PASTE_CONSUMER_KEY_HERE"
API_SECRET="PASTE_CONSUMER_SECRET_HERE"
ACCESS_TOKEN="PASTE_ACCESS_TOKEN_HERE"
ACCESS_SECRET="PASTE_ACCESS_TOKEN_SECRET_HERE"

# Tweet content
TWEET_TEXT="Hello X! Testing API post with cURL $(date +%s)"

# API endpoint
URL="https://api.twitter.com/2/tweets"

# Generate OAuth 1.0a parameters
NONCE=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
TIMESTAMP=$(date +%s)

# Create signature base string
OAUTH_PARAMS="oauth_consumer_key=${API_KEY}&oauth_nonce=${NONCE}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=${TIMESTAMP}&oauth_token=${ACCESS_TOKEN}&oauth_version=1.0"

# URL encode
BASE_STRING="POST&$(echo -n "$URL" | jq -sRr @uri)&$(echo -n "$OAUTH_PARAMS" | jq -sRr @uri)"

# Generate signature
SIGNING_KEY="${API_SECRET}&${ACCESS_SECRET}"
SIGNATURE=$(echo -n "$BASE_STRING" | openssl dgst -sha1 -hmac "$SIGNING_KEY" -binary | base64)

# Build Authorization header
AUTH_HEADER="OAuth oauth_consumer_key=\"${API_KEY}\", oauth_nonce=\"${NONCE}\", oauth_signature=\"$(echo -n "$SIGNATURE" | jq -sRr @uri)\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"${TIMESTAMP}\", oauth_token=\"${ACCESS_TOKEN}\", oauth_version=\"1.0\""

# Make the request
curl -X POST "$URL" \
  -H "Authorization: ${AUTH_HEADER}" \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"${TWEET_TEXT}\"}"
