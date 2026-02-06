# OAuth 1.0a credentials - Get these from X Developer Console > OAuth 1.0 Keys
$API_KEY = "PASTE_CONSUMER_KEY_HERE"
$API_SECRET = "PASTE_CONSUMER_SECRET_HERE"
$ACCESS_TOKEN = "PASTE_ACCESS_TOKEN_HERE"
$ACCESS_SECRET = "PASTE_ACCESS_TOKEN_SECRET_HERE"

# Tweet content
$TWEET_TEXT = "Hello X! Testing API post with PowerShell $([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"

# API endpoint
$URL = "https://api.twitter.com/2/tweets"

# Generate OAuth 1.0a parameters
$NONCE = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$TIMESTAMP = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

# Create signature base string
$oauth_params = @{
    oauth_consumer_key = $API_KEY
    oauth_nonce = $NONCE
    oauth_signature_method = "HMAC-SHA1"
    oauth_timestamp = $TIMESTAMP
    oauth_token = $ACCESS_TOKEN
    oauth_version = "1.0"
}

# Sort and build parameter string
$param_string = ($oauth_params.GetEnumerator() | Sort-Object Key | ForEach-Object {
    "$($_.Key)=$([System.Uri]::EscapeDataString($_.Value))"
}) -join "&"

# Build signature base string
$base_string = "POST&" + [System.Uri]::EscapeDataString($URL) + "&" + [System.Uri]::EscapeDataString($param_string)

# Generate signature
$signing_key = [System.Uri]::EscapeDataString($API_SECRET) + "&" + [System.Uri]::EscapeDataString($ACCESS_SECRET)
$hmacsha1 = New-Object System.Security.Cryptography.HMACSHA1
$hmacsha1.Key = [System.Text.Encoding]::ASCII.GetBytes($signing_key)
$signature = [System.Convert]::ToBase64String($hmacsha1.ComputeHash([System.Text.Encoding]::ASCII.GetBytes($base_string)))

# Build Authorization header
$auth_header = 'OAuth oauth_consumer_key="' + [System.Uri]::EscapeDataString($API_KEY) + '", ' +
               'oauth_nonce="' + [System.Uri]::EscapeDataString($NONCE) + '", ' +
               'oauth_signature="' + [System.Uri]::EscapeDataString($signature) + '", ' +
               'oauth_signature_method="HMAC-SHA1", ' +
               'oauth_timestamp="' + $TIMESTAMP + '", ' +
               'oauth_token="' + [System.Uri]::EscapeDataString($ACCESS_TOKEN) + '", ' +
               'oauth_version="1.0"'

# Prepare the body
$body = @{
    text = $TWEET_TEXT
} | ConvertTo-Json

# Make the request
$response = Invoke-WebRequest -Uri $URL -Method POST -Headers @{
    "Authorization" = $auth_header
    "Content-Type" = "application/json"
} -Body $body

# Output response
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
