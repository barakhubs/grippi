<?php
// 1. Setup your credentials
$page_id = '1972404640321943';
$access_token = 'EAAMcvwdk8bwBQhZCSUUwLbFsZBZAbcyAl38UVcNFMIxVdL5kcByEvrvq52KN3LZCLuq5SyJJdz5oy3uvMvohkhHn4oOSVbVlMwag8LqZB5mZALqevAkrzzt9eIqkBZAXtySaWjUZA2VwTLK1Kq2DY3WrjDBkFWAF1MNhgra2wQE6zpfZC7wvg3528VADx8F6opvIa6JC528f6c95WOXNpQ8aiqxHlXBe2CLygSj5gcLjvO7XP';
$message = 'Hello world! Sent via PHP cURL in 2026.';

// 2. The API endpoint
$url = "https://graph.facebook.com/v18.0/{$page_id}/feed";

// 3. Prepare the data
$data = [
    'message' => $message,
    'access_token' => $access_token
];

// 4. Initialize and execute cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

// 5. Check the result
if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo "Response: " . $response;
}
?>