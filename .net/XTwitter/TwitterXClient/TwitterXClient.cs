using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace XTwitterSdk
{
    /// <summary>
    /// Sync, GeneXus-friendly X (Twitter) client:
    /// - Post tweet (text)
    /// - Post tweet with Image URLs (downloads → uploads → tweets)
    /// - Post tweet with Video URLs (downloads → chunked upload INIT/APPEND/FINALIZE/STATUS → tweets)
    /// - Delete tweet
    ///
    /// Notes:
    /// - Media upload uses v1.1: https://upload.twitter.com/1.1/media/upload.json
    /// - Tweet create/delete uses v2: https://api.twitter.com/2/tweets
    /// - OAuth 1.0a (HMAC-SHA1)
    /// </summary>
    public class XTwitterClient
    {
        private const string TweetUrlV2 = "https://api.twitter.com/2/tweets";
        private const string MediaUploadUrlV11 = "https://upload.twitter.com/1.1/media/upload.json";

        // -----------------------------
        // PUBLIC API
        // -----------------------------

        public void PostTweet(
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            string tweetText,
            out bool success,
            out int statusCode,
            out string response)
        {
            var body = "{\"text\":\"" + EscapeJson(tweetText) + "\"}";
            OAuthJsonPostV2(TweetUrlV2, body, apiKey, apiSecret, accessToken, accessSecret, out success, out statusCode, out response);
        }

        public void PostTweetWithImageUrls(
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            string tweetText,
            List<string> imageUrls,
            out bool success,
            out int statusCode,
            out string response)
        {
            success = false;
            statusCode = 0;
            response = "";

            if (imageUrls == null || imageUrls.Count == 0)
            {
                response = "No image URLs provided.";
                return;
            }

            var mediaIds = new List<string>();

            foreach (var url in imageUrls)
            {
                if (!DownloadBytesFromUrl(url, out var bytes, out var contentType, out var dlErr))
                {
                    response = "Download failed: " + dlErr;
                    return;
                }

                // Ensure it's an image; if server doesn't give content-type, try by URL extension
                contentType = NormalizeImageContentType(contentType, url);
                if (!contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                {
                    response = "URL is not an image (Content-Type: " + contentType + ").";
                    return;
                }

                var mediaId = UploadImageBytes(apiKey, apiSecret, accessToken, accessSecret, bytes, contentType,
                    out var upOk, out var upCode, out var upResp);

                if (!upOk || string.IsNullOrEmpty(mediaId))
                {
                    success = false;
                    statusCode = upCode;
                    response = upResp;
                    return;
                }

                mediaIds.Add(mediaId);
            }

            SendTweetWithMediaIds(apiKey, apiSecret, accessToken, accessSecret, tweetText, mediaIds,
                out success, out statusCode, out response);
        }

        public void PostTweetWithVideoUrls(
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            string tweetText,
            List<string> videoUrls,
            out bool success,
            out int statusCode,
            out string response)
        {
            success = false;
            statusCode = 0;
            response = "";

            if (videoUrls == null || videoUrls.Count == 0)
            {
                response = "No video URLs provided.";
                return;
            }

            var mediaIds = new List<string>();

            foreach (var url in videoUrls)
            {
                if (!DownloadBytesFromUrl(url, out var bytes, out var contentType, out var dlErr))
                {
                    response = "Download failed: " + dlErr;
                    return;
                }

                // X tweet_video expects MP4 (video/mp4). If content-type missing, infer by extension.
                contentType = NormalizeVideoContentType(contentType, url);
                if (!contentType.Equals("video/mp4", StringComparison.OrdinalIgnoreCase))
                {
                    response = "Video must be MP4 (video/mp4). Detected: " + contentType;
                    return;
                }

                var mediaId = UploadVideoBytesChunked(apiKey, apiSecret, accessToken, accessSecret, bytes, contentType,
                    out var upOk, out var upCode, out var upResp);

                if (!upOk || string.IsNullOrEmpty(mediaId))
                {
                    success = false;
                    statusCode = upCode;
                    response = upResp;
                    return;
                }

                mediaIds.Add(mediaId);
            }

            SendTweetWithMediaIds(apiKey, apiSecret, accessToken, accessSecret, tweetText, mediaIds,
                out success, out statusCode, out response);
        }

        public void DeleteTweet(
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            string tweetId,
            out bool success,
            out int statusCode,
            out string response)
        {
            success = false;
            statusCode = 0;
            response = "";

            var url = TweetUrlV2.TrimEnd('/') + "/" + tweetId;

            try
            {
                var auth = BuildOAuthHeader(
                    method: "DELETE",
                    baseUrl: url,
                    apiKey: apiKey,
                    apiSecret: apiSecret,
                    accessToken: accessToken,
                    accessSecret: accessSecret,
                    signatureParams: null,
                    includeBodyHash: false,
                    bodyBytes: null);

                var req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "DELETE";
                req.Headers.Add("Authorization", auth);

                using var resp = (HttpWebResponse)req.GetResponse();
                using var reader = new StreamReader(resp.GetResponseStream());
                statusCode = (int)resp.StatusCode;
                response = reader.ReadToEnd();
                success = resp.StatusCode == HttpStatusCode.OK;
            }
            catch (WebException ex)
            {
                HandleWebException(ex, out statusCode, out response);
            }
        }

        // -----------------------------
        // INTERNAL: Tweet with media_ids
        // -----------------------------

        private void SendTweetWithMediaIds(
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            string tweetText,
            List<string> mediaIds,
            out bool success,
            out int statusCode,
            out string response)
        {
            string body;
            if (mediaIds != null && mediaIds.Count > 0)
            {
                var sb = new StringBuilder();
                sb.Append("{\"text\":\"").Append(EscapeJson(tweetText)).Append("\",\"media\":{\"media_ids\":[");
                for (int i = 0; i < mediaIds.Count; i++)
                {
                    if (i > 0) sb.Append(",");
                    sb.Append("\"").Append(mediaIds[i]).Append("\"");
                }
                sb.Append("]}}}");
                body = sb.ToString();
            }
            else
            {
                body = "{\"text\":\"" + EscapeJson(tweetText) + "\"}";
            }

            OAuthJsonPostV2(TweetUrlV2, body, apiKey, apiSecret, accessToken, accessSecret, out success, out statusCode, out response);
        }

        // -----------------------------
        // INTERNAL: Image upload (single multipart)
        // -----------------------------

        private string UploadImageBytes(
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            byte[] bytes,
            string contentType,
            out bool success,
            out int statusCode,
            out string response)
        {
            success = false;
            statusCode = 0;
            response = "";

            try
            {
                var auth = BuildOAuthHeader(
                    method: "POST",
                    baseUrl: MediaUploadUrlV11,
                    apiKey: apiKey,
                    apiSecret: apiSecret,
                    accessToken: accessToken,
                    accessSecret: accessSecret,
                    signatureParams: null,
                    includeBodyHash: false,
                    bodyBytes: null);

                var req = (HttpWebRequest)WebRequest.Create(MediaUploadUrlV11);
                req.Method = "POST";
                req.Headers.Add("Authorization", auth);

                string boundary = "----XBoundary" + Guid.NewGuid().ToString("N");
                req.ContentType = "multipart/form-data; boundary=" + boundary;

                using (var stream = req.GetRequestStream())
                {
                    WriteMultipartMedia(stream, boundary, bytes, contentType);
                    WriteBoundaryEnd(stream, boundary);
                }

                using var resp = (HttpWebResponse)req.GetResponse();
                using var reader = new StreamReader(resp.GetResponseStream());
                statusCode = (int)resp.StatusCode;
                response = reader.ReadToEnd();
                success = resp.StatusCode == HttpStatusCode.OK;

                if (!success) return null;
                return ExtractJsonValue(response, "media_id_string");
            }
            catch (WebException ex)
            {
                HandleWebException(ex, out statusCode, out response);
                return null;
            }
        }

        // -----------------------------
        // INTERNAL: Video upload (chunked INIT/APPEND/FINALIZE/STATUS)
        // -----------------------------

        private string UploadVideoBytesChunked(
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            byte[] videoBytes,
            string mediaType,
            out bool success,
            out int statusCode,
            out string response)
        {
            success = false;
            statusCode = 0;
            response = "";

            // 1) INIT
            var initParams = new Dictionary<string, string>
            {
                { "command", "INIT" },
                { "total_bytes", videoBytes.Length.ToString() },
                { "media_type", mediaType },
                { "media_category", "tweet_video" }
            };

            var initResp = OAuthFormPost(MediaUploadUrlV11, initParams, apiKey, apiSecret, accessToken, accessSecret,
                out var initOk, out var initCode, out var initBody);

            if (!initOk)
            {
                success = false; statusCode = initCode; response = initBody;
                return null;
            }

            var mediaId = ExtractJsonValue(initResp, "media_id_string");
            if (string.IsNullOrEmpty(mediaId))
            {
                success = false; statusCode = initCode; response = initResp;
                return null;
            }

            // 2) APPEND chunks (5MB)
            const int chunkSize = 5 * 1024 * 1024;
            int segmentIndex = 0;

            for (int offset = 0; offset < videoBytes.Length; offset += chunkSize)
            {
                int size = Math.Min(chunkSize, videoBytes.Length - offset);
                byte[] chunk = new byte[size];
                Buffer.BlockCopy(videoBytes, offset, chunk, 0, size);

                OAuthAppendMultipart(MediaUploadUrlV11, mediaId, segmentIndex, chunk,
                    apiKey, apiSecret, accessToken, accessSecret,
                    out var appOk, out var appCode, out var appBody);

                if (!appOk)
                {
                    success = false; statusCode = appCode; response = appBody;
                    return null;
                }

                segmentIndex++;
            }

            // 3) FINALIZE
            var finParams = new Dictionary<string, string>
            {
                { "command", "FINALIZE" },
                { "media_id", mediaId }
            };

            var finResp = OAuthFormPost(MediaUploadUrlV11, finParams, apiKey, apiSecret, accessToken, accessSecret,
                out var finOk, out var finCode, out var finBody);

            if (!finOk)
            {
                success = false; statusCode = finCode; response = finBody;
                return null;
            }

            // 4) STATUS polling (video processing)
            // Not all responses include processing_info; if state absent, assume ready.
            string state = ExtractJsonValue(finResp, "state"); // pending, in_progress, succeeded, failed
            int tries = 0;

            while (!string.IsNullOrEmpty(state) &&
                   state != "succeeded" &&
                   state != "failed" &&
                   tries < 30)
            {
                System.Threading.Thread.Sleep(2000);

                var stParams = new Dictionary<string, string>
                {
                    { "command", "STATUS" },
                    { "media_id", mediaId }
                };

                var stResp = OAuthFormGet(MediaUploadUrlV11, stParams, apiKey, apiSecret, accessToken, accessSecret,
                    out var stOk, out var stCode, out var stBody);

                if (!stOk)
                {
                    success = false; statusCode = stCode; response = stBody;
                    return null;
                }

                state = ExtractJsonValue(stResp, "state");
                tries++;
            }

            if (!string.IsNullOrEmpty(state) && state == "failed")
            {
                success = false;
                statusCode = 400;
                response = finResp;
                return null;
            }

            success = true;
            statusCode = 200;
            response = "{\"media_id_string\":\"" + mediaId + "\"}";
            return mediaId;
        }

        // -----------------------------
        // HTTP + OAUTH helpers
        // -----------------------------

        private void OAuthJsonPostV2(
            string url,
            string jsonBody,
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            out bool success,
            out int statusCode,
            out string responseBody)
        {
            success = false;
            statusCode = 0;
            responseBody = "";

            try
            {
                // Compute oauth_body_hash for JSON bodies (helps avoid 401 signature mismatches on v2).
                byte[] bodyBytes = Encoding.UTF8.GetBytes(jsonBody);

                var auth = BuildOAuthHeader(
                    method: "POST",
                    baseUrl: url,
                    apiKey: apiKey,
                    apiSecret: apiSecret,
                    accessToken: accessToken,
                    accessSecret: accessSecret,
                    signatureParams: null,
                    includeBodyHash: true,
                    bodyBytes: bodyBytes);

                var req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.ContentType = "application/json";
                req.Headers.Add("Authorization", auth);

                using (var s = req.GetRequestStream())
                    s.Write(bodyBytes, 0, bodyBytes.Length);

                using var resp = (HttpWebResponse)req.GetResponse();
                using var reader = new StreamReader(resp.GetResponseStream());

                statusCode = (int)resp.StatusCode;
                responseBody = reader.ReadToEnd();
                success = resp.StatusCode == HttpStatusCode.Created;
            }
            catch (WebException ex)
            {
                HandleWebException(ex, out statusCode, out responseBody);
            }
        }

        private string OAuthFormPost(
            string url,
            Dictionary<string, string> formParams,
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            out bool success,
            out int statusCode,
            out string responseBody)
        {
            success = false;
            statusCode = 0;
            responseBody = "";

            try
            {
                var auth = BuildOAuthHeader(
                    method: "POST",
                    baseUrl: url,
                    apiKey: apiKey,
                    apiSecret: apiSecret,
                    accessToken: accessToken,
                    accessSecret: accessSecret,
                    signatureParams: formParams,
                    includeBodyHash: false,
                    bodyBytes: null);

                var req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.ContentType = "application/x-www-form-urlencoded";
                req.Headers.Add("Authorization", auth);

                string body = BuildQueryString(new SortedDictionary<string, string>(formParams));
                byte[] bytes = Encoding.UTF8.GetBytes(body);

                using (var s = req.GetRequestStream())
                    s.Write(bytes, 0, bytes.Length);

                using var resp = (HttpWebResponse)req.GetResponse();
                using var reader = new StreamReader(resp.GetResponseStream());

                statusCode = (int)resp.StatusCode;
                responseBody = reader.ReadToEnd();
                success = resp.StatusCode == HttpStatusCode.OK || resp.StatusCode == HttpStatusCode.Accepted;

                return responseBody;
            }
            catch (WebException ex)
            {
                HandleWebException(ex, out statusCode, out responseBody);
                return responseBody;
            }
        }

        private string OAuthFormGet(
            string url,
            Dictionary<string, string> queryParams,
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            out bool success,
            out int statusCode,
            out string responseBody)
        {
            success = false;
            statusCode = 0;
            responseBody = "";

            try
            {
                string qs = BuildQueryString(new SortedDictionary<string, string>(queryParams));
                string fullUrl = url + "?" + qs;

                var auth = BuildOAuthHeader(
                    method: "GET",
                    baseUrl: url,
                    apiKey: apiKey,
                    apiSecret: apiSecret,
                    accessToken: accessToken,
                    accessSecret: accessSecret,
                    signatureParams: queryParams,
                    includeBodyHash: false,
                    bodyBytes: null);

                var req = (HttpWebRequest)WebRequest.Create(fullUrl);
                req.Method = "GET";
                req.Headers.Add("Authorization", auth);

                using var resp = (HttpWebResponse)req.GetResponse();
                using var reader = new StreamReader(resp.GetResponseStream());

                statusCode = (int)resp.StatusCode;
                responseBody = reader.ReadToEnd();
                success = resp.StatusCode == HttpStatusCode.OK || resp.StatusCode == HttpStatusCode.Accepted;

                return responseBody;
            }
            catch (WebException ex)
            {
                HandleWebException(ex, out statusCode, out responseBody);
                return responseBody;
            }
        }

        private void OAuthAppendMultipart(
            string url,
            string mediaId,
            int segmentIndex,
            byte[] chunk,
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            out bool success,
            out int statusCode,
            out string responseBody)
        {
            success = false;
            statusCode = 0;
            responseBody = "";

            var sigParams = new Dictionary<string, string>
            {
                { "command", "APPEND" },
                { "media_id", mediaId },
                { "segment_index", segmentIndex.ToString() }
            };

            try
            {
                var auth = BuildOAuthHeader(
                    method: "POST",
                    baseUrl: url,
                    apiKey: apiKey,
                    apiSecret: apiSecret,
                    accessToken: accessToken,
                    accessSecret: accessSecret,
                    signatureParams: sigParams,
                    includeBodyHash: false,
                    bodyBytes: null);

                string boundary = "----XBoundary" + Guid.NewGuid().ToString("N");

                var req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.Headers.Add("Authorization", auth);
                req.ContentType = "multipart/form-data; boundary=" + boundary;

                using (var stream = req.GetRequestStream())
                {
                    WriteFormField(stream, boundary, "command", "APPEND");
                    WriteFormField(stream, boundary, "media_id", mediaId);
                    WriteFormField(stream, boundary, "segment_index", segmentIndex.ToString());

                    string header =
                        $"--{boundary}\r\n" +
                        "Content-Disposition: form-data; name=\"media\"; filename=\"chunk\"\r\n" +
                        "Content-Type: application/octet-stream\r\n\r\n";
                    byte[] headerBytes = Encoding.UTF8.GetBytes(header);
                    stream.Write(headerBytes, 0, headerBytes.Length);
                    stream.Write(chunk, 0, chunk.Length);
                    stream.Write(Encoding.UTF8.GetBytes("\r\n"), 0, 2);

                    WriteBoundaryEnd(stream, boundary);
                }

                using var resp = (HttpWebResponse)req.GetResponse();
                statusCode = (int)resp.StatusCode;

                // On success APPEND often returns 204 No Content.
                responseBody = "";
                success = resp.StatusCode == HttpStatusCode.NoContent || resp.StatusCode == HttpStatusCode.OK;
            }
            catch (WebException ex)
            {
                HandleWebException(ex, out statusCode, out responseBody);
            }
        }

        /// <summary>
        /// Builds OAuth 1.0a Authorization header.
        /// signatureParams are request params that must be included in the signature base string (e.g. INIT/FINALIZE/STATUS params).
        /// If includeBodyHash is true, oauth_body_hash is added for JSON body signing (v2 tweet create).
        /// </summary>
        private string BuildOAuthHeader(
            string method,
            string baseUrl,
            string apiKey,
            string apiSecret,
            string accessToken,
            string accessSecret,
            IDictionary<string, string> signatureParams,
            bool includeBodyHash,
            byte[] bodyBytes)
        {
            // Safer defaults on older .NET installs
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            ServicePointManager.Expect100Continue = false;

            string nonce = Guid.NewGuid().ToString("N");
            string timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();

            var oauth = new SortedDictionary<string, string>
            {
                { "oauth_consumer_key", apiKey },
                { "oauth_nonce", nonce },
                { "oauth_signature_method", "HMAC-SHA1" },
                { "oauth_timestamp", timestamp },
                { "oauth_token", accessToken },
                { "oauth_version", "1.0" }
            };

            if (includeBodyHash)
            {
                oauth["oauth_body_hash"] = ComputeOAuthBodyHashSha1(bodyBytes ?? Array.Empty<byte>());
            }

            // Signature base parameters = oauth + request parameters (query/form fields)
            var sig = new SortedDictionary<string, string>(oauth);
            if (signatureParams != null)
            {
                foreach (var kv in signatureParams)
                    sig[kv.Key] = kv.Value;
            }

            string paramString = BuildQueryString(sig);
            string baseString = method.ToUpperInvariant() + "&" + UrlEncode(baseUrl) + "&" + UrlEncode(paramString);

            string signingKey = UrlEncode(apiSecret) + "&" + UrlEncode(accessSecret);

            using var hmac = new HMACSHA1(Encoding.ASCII.GetBytes(signingKey));
            string signature = Convert.ToBase64String(hmac.ComputeHash(Encoding.ASCII.GetBytes(baseString)));

            oauth["oauth_signature"] = signature;

            return "OAuth " + BuildOAuthHeaderString(oauth);
        }

        private static string ComputeOAuthBodyHashSha1(byte[] bodyBytes)
        {
            using var sha1 = SHA1.Create();
            return Convert.ToBase64String(sha1.ComputeHash(bodyBytes ?? Array.Empty<byte>()));
        }

        // -----------------------------
        // Download helper (URL → bytes)
        // -----------------------------

        private bool DownloadBytesFromUrl(string url, out byte[] bytes, out string contentType, out string error)
        {
            bytes = null;
            contentType = "application/octet-stream";
            error = "";

            try
            {
                var req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "GET";
                req.AllowAutoRedirect = true;
                req.UserAgent = "Mozilla/5.0";
                req.Timeout = 120000;

                using var resp = (HttpWebResponse)req.GetResponse();
                contentType = resp.ContentType ?? "application/octet-stream";

                using var ms = new MemoryStream();
                using var stream = resp.GetResponseStream();
                stream.CopyTo(ms);

                bytes = ms.ToArray();
                if (bytes.Length == 0)
                {
                    error = "Empty response body.";
                    return false;
                }

                // Guard: many “share links” return HTML instead of the file
                if (contentType.Contains("text/html", StringComparison.OrdinalIgnoreCase))
                {
                    error = "URL returned HTML (not a direct file link). Use a direct download URL.";
                    return false;
                }

                return true;
            }
            catch (WebException ex)
            {
                if (ex.Response is HttpWebResponse r)
                {
                    using var reader = new StreamReader(r.GetResponseStream());
                    error = $"HTTP {(int)r.StatusCode} {r.StatusCode}: {reader.ReadToEnd()}";
                }
                else
                {
                    error = ex.Message;
                }
                return false;
            }
            catch (Exception ex)
            {
                error = ex.Message;
                return false;
            }
        }

        private static string NormalizeImageContentType(string contentType, string url)
        {
            if (!string.IsNullOrWhiteSpace(contentType) && contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                return contentType.Split(';')[0].Trim();

            string lower = (url ?? "").ToLowerInvariant();
            if (lower.Contains(".png")) return "image/png";
            if (lower.Contains(".gif")) return "image/gif";
            if (lower.Contains(".jpg") || lower.Contains(".jpeg")) return "image/jpeg";
            if (lower.Contains(".webp")) return "image/webp";
            return (contentType ?? "image/jpeg").Split(';')[0].Trim();
        }

        private static string NormalizeVideoContentType(string contentType, string url)
        {
            if (!string.IsNullOrWhiteSpace(contentType) && contentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
                return contentType.Split(';')[0].Trim();

            string lower = (url ?? "").ToLowerInvariant();
            if (lower.Contains(".mp4")) return "video/mp4";
            return (contentType ?? "video/mp4").Split(';')[0].Trim();
        }

        // -----------------------------
        // Low-level helpers
        // -----------------------------

        private static void HandleWebException(WebException ex, out int statusCode, out string response)
        {
            statusCode = 0;
            response = ex.Message;

            if (ex.Response is HttpWebResponse resp)
            {
                statusCode = (int)resp.StatusCode;
                using var reader = new StreamReader(resp.GetResponseStream());
                response = reader.ReadToEnd();
            }
        }

        private static void WriteMultipartMedia(Stream stream, string boundary, byte[] data, string contentType)
        {
            string header =
                $"--{boundary}\r\n" +
                "Content-Disposition: form-data; name=\"media\"; filename=\"file\"\r\n" +
                $"Content-Type: {contentType}\r\n\r\n";

            byte[] headerBytes = Encoding.UTF8.GetBytes(header);
            stream.Write(headerBytes, 0, headerBytes.Length);
            stream.Write(data, 0, data.Length);
            stream.Write(Encoding.UTF8.GetBytes("\r\n"), 0, 2);
        }

        private static void WriteFormField(Stream stream, string boundary, string name, string value)
        {
            string field =
                $"--{boundary}\r\n" +
                $"Content-Disposition: form-data; name=\"{name}\"\r\n\r\n" +
                value + "\r\n";

            byte[] bytes = Encoding.UTF8.GetBytes(field);
            stream.Write(bytes, 0, bytes.Length);
        }

        private static void WriteBoundaryEnd(Stream stream, string boundary)
        {
            byte[] end = Encoding.UTF8.GetBytes($"--{boundary}--\r\n");
            stream.Write(end, 0, end.Length);
        }

        private static string BuildQueryString(SortedDictionary<string, string> parameters)
        {
            var list = new List<string>();
            foreach (var p in parameters)
                list.Add($"{UrlEncode(p.Key)}={UrlEncode(p.Value)}");
            return string.Join("&", list);
        }

        private static string BuildOAuthHeaderString(SortedDictionary<string, string> parameters)
        {
            var list = new List<string>();
            foreach (var p in parameters)
                list.Add($"{p.Key}=\"{UrlEncode(p.Value)}\"");
            return string.Join(", ", list);
        }

        private static string UrlEncode(string value)
        {
            return Uri.EscapeDataString(value ?? "");
        }

        private static string EscapeJson(string value)
        {
            return (value ?? "").Replace("\\", "\\\\").Replace("\"", "\\\"");
        }

        /// <summary>
        /// Lightweight JSON string-value extractor:
        /// Looks for: "key":"value"
        /// (Good enough for media_id_string, state)
        /// </summary>
        private static string ExtractJsonValue(string json, string key)
        {
            if (string.IsNullOrEmpty(json) || string.IsNullOrEmpty(key))
                return null;

            string search = $"\"{key}\":\"";
            int idx = json.IndexOf(search, StringComparison.OrdinalIgnoreCase);
            if (idx < 0) return null;

            idx += search.Length;
            int end = json.IndexOf("\"", idx);
            if (end < 0) return null;

            return json.Substring(idx, end - idx);
        }
    }
}
