<?php
// 1. YOUR CREDENTIALS (Get these from "Keys and Tokens" in X Dev Portal)
$api_key = 'Mu4mj2jjsFXqJf6SJKGfNoWST';
$api_secret = 'yEOk6oOmjeMJlMD3yYKjcI27Pxas1PZuaKd9wMZpILDeHY9zD6';
$access_token = '1489624681493716994-NdzctXLzgHXUNnVToa6PuTCYeQ0GHB';
$access_secret = 'Ssfwmt10Siq3yiUIL4JXohhDzZ97vu4ebX62Kzjm4EqEa';

$url = "https://api.twitter.com/2/tweets";

// 2. THE TWEET CONTENT (Simple is best for testing)
$post_fields = ['text' => 'Hello X! My first successful API post. ' . time()];

// 3. GENERATE OAUTH 1.0A SIGNATURE (X requires this for POSTing)
$nonce = bin2hex(random_bytes(16));
$timestamp = time();
$oauth = [
    'oauth_consumer_key' => $api_key,
    'oauth_nonce' => $nonce,
    'oauth_signature_method' => 'HMAC-SHA1',
    'oauth_timestamp' => $timestamp,
    'oauth_token' => $access_token,
    'oauth_version' => '1.0'
];

$base_params = $oauth;
ksort($base_params);
$query_string = http_build_query($base_params, '', '&', PHP_QUERY_RFC3986);
$base_string = "POST&" . rawurlencode($url) . "&" . rawurlencode($query_string);
$signing_key = rawurlencode($api_secret) . "&" . rawurlencode($access_secret);
$oauth['oauth_signature'] = base64_encode(hash_hmac('sha1', $base_string, $signing_key, true));

$auth_header = 'Authorization: OAuth ';
$values = [];
foreach ($oauth as $key => $value) {
    $values[] = rawurlencode($key) . '="' . rawurlencode($value) . '"';
}
$auth_header .= implode(', ', $values);

// 4. THE CURL REQUEST
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($post_fields),
    CURLOPT_HTTPHEADER => [
        $auth_header,
        "Content-Type: application/json"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo $response;
}



// client secret ID: Z0wzQ0xha2IyRDdFX3UwMFNhRE06MTpjaQ
// client scret:DCMmSfnCYYW8LXA_m6kSJVAJcMZbOZSKxNSu62lj666-iZ64Nk