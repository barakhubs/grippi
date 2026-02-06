using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.RegularExpressions;

namespace FacebookSdk
{
    public class FacebookClient
    {
        public FacebookClient()
        {
            // TLS for Graph API
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls13;

            // NOTE: Accepting all certs is NOT recommended in production.
            // Keep this only if you really need it for dev environments.
            ServicePointManager.ServerCertificateValidationCallback =
                (sender, certificate, chain, sslPolicyErrors) => true;
        }

        /// <summary>
        /// Posts a message to a Facebook Page
        /// </summary>
        public void PostToPage(
            string pageId,
            string pageAccessToken,
            string message,
            out bool success,
            out int statusCode,
            out string response
        )
        {
            success = false;
            statusCode = 0;
            response = "";

            try
            {
                string url = $"https://graph.facebook.com/v19.0/{pageId}/feed";

                string postData =
                    "message=" + Uri.EscapeDataString(message ?? "") +
                    "&access_token=" + Uri.EscapeDataString(pageAccessToken ?? "");

                byte[] dataBytes = Encoding.UTF8.GetBytes(postData);

                var request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                request.ContentLength = dataBytes.Length;

                using (var stream = request.GetRequestStream())
                {
                    stream.Write(dataBytes, 0, dataBytes.Length);
                }

                using (var resp = (HttpWebResponse)request.GetResponse())
                using (var reader = new StreamReader(resp.GetResponseStream()))
                {
                    statusCode = (int)resp.StatusCode;
                    response = reader.ReadToEnd();
                    success = resp.StatusCode == HttpStatusCode.OK;
                }
            }
            catch (WebException ex)
            {
                HandleWebException(ex, out statusCode, out response);
            }
            catch (Exception ex)
            {
                response = ex.Message + (ex.InnerException != null ? " | Inner: " + ex.InnerException.Message : "");
            }
        }

        /// <summary>
        /// Posts a photo to a Facebook Page (supports both URLs and local file paths)
        /// </summary>
        public void PostPhoto(
            string pageId,
            string pageAccessToken,
            string imagePathOrUrl,
            string caption,
            out bool success,
            out int statusCode,
            out string response
        )
        {
            success = false;
            statusCode = 0;
            response = "";

            try
            {
                bool isUrl = IsHttpUrl(imagePathOrUrl);

                string url = $"https://graph.facebook.com/v19.0/{pageId}/photos";

                if (isUrl)
                {
                    string postData =
                        "url=" + Uri.EscapeDataString(imagePathOrUrl ?? "") +
                        "&caption=" + Uri.EscapeDataString(caption ?? "") +
                        "&access_token=" + Uri.EscapeDataString(pageAccessToken ?? "");

                    byte[] dataBytes = Encoding.UTF8.GetBytes(postData);

                    var request = (HttpWebRequest)WebRequest.Create(url);
                    request.Method = "POST";
                    request.ContentType = "application/x-www-form-urlencoded";
                    request.ContentLength = dataBytes.Length;

                    using (var stream = request.GetRequestStream())
                    {
                        stream.Write(dataBytes, 0, dataBytes.Length);
                    }

                    using (var resp = (HttpWebResponse)request.GetResponse())
                    using (var reader = new StreamReader(resp.GetResponseStream()))
                    {
                        statusCode = (int)resp.StatusCode;
                        response = reader.ReadToEnd();
                        success = resp.StatusCode == HttpStatusCode.OK;
                    }
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(imagePathOrUrl) || !File.Exists(imagePathOrUrl))
                    {
                        response = "Image file not found: " + imagePathOrUrl;
                        return;
                    }

                    string boundary = "----" + DateTime.Now.Ticks.ToString("x");

                    var request = (HttpWebRequest)WebRequest.Create(url);
                    request.Method = "POST";
                    request.ContentType = "multipart/form-data; boundary=" + boundary;

                    using (var ms = new MemoryStream())
                    {
                        byte[] boundaryBytes = Encoding.UTF8.GetBytes("\r\n--" + boundary + "\r\n");

                        // caption
                        ms.Write(boundaryBytes, 0, boundaryBytes.Length);
                        string captionHeader = "Content-Disposition: form-data; name=\"caption\"\r\n\r\n" + (caption ?? "");
                        ms.Write(Encoding.UTF8.GetBytes(captionHeader), 0, Encoding.UTF8.GetByteCount(captionHeader));

                        // access token
                        ms.Write(boundaryBytes, 0, boundaryBytes.Length);
                        string tokenHeader = "Content-Disposition: form-data; name=\"access_token\"\r\n\r\n" + (pageAccessToken ?? "");
                        ms.Write(Encoding.UTF8.GetBytes(tokenHeader), 0, Encoding.UTF8.GetByteCount(tokenHeader));

                        // file
                        ms.Write(boundaryBytes, 0, boundaryBytes.Length);
                        string fileHeader = $"Content-Disposition: form-data; name=\"source\"; filename=\"{Path.GetFileName(imagePathOrUrl)}\"\r\n";
                        fileHeader += "Content-Type: application/octet-stream\r\n\r\n";
                        ms.Write(Encoding.UTF8.GetBytes(fileHeader), 0, Encoding.UTF8.GetByteCount(fileHeader));

                        byte[] imageBytes = File.ReadAllBytes(imagePathOrUrl);
                        ms.Write(imageBytes, 0, imageBytes.Length);

                        // end boundary
                        byte[] endBoundary = Encoding.UTF8.GetBytes("\r\n--" + boundary + "--\r\n");
                        ms.Write(endBoundary, 0, endBoundary.Length);

                        request.ContentLength = ms.Length;
                        ms.Position = 0;

                        using (var stream = request.GetRequestStream())
                        {
                            ms.CopyTo(stream);
                        }
                    }

                    using (var resp = (HttpWebResponse)request.GetResponse())
                    using (var reader = new StreamReader(resp.GetResponseStream()))
                    {
                        statusCode = (int)resp.StatusCode;
                        response = reader.ReadToEnd();
                        success = resp.StatusCode == HttpStatusCode.OK;
                    }
                }
            }
            catch (WebException ex)
            {
                HandleWebException(ex, out statusCode, out response);
            }
            catch (Exception ex)
            {
                response = ex.Message + (ex.InnerException != null ? " | Inner: " + ex.InnerException.Message : "");
            }
        }

        /// <summary>
        /// Posts a video to a Facebook Page (supports both URLs and local file paths)
        /// </summary>
        public void PostVideo(
            string pageId,
            string pageAccessToken,
            string videoPathOrUrl,
            string description,
            out bool success,
            out int statusCode,
            out string response
        )
        {
            success = false;
            statusCode = 0;
            response = "";

            try
            {
                bool isUrl = IsHttpUrl(videoPathOrUrl);
                string url = $"https://graph.facebook.com/v19.0/{pageId}/videos";

                if (isUrl)
                {
                    string postData =
                        "file_url=" + Uri.EscapeDataString(videoPathOrUrl ?? "") +
                        "&description=" + Uri.EscapeDataString(description ?? "") +
                        "&access_token=" + Uri.EscapeDataString(pageAccessToken ?? "");

                    byte[] dataBytes = Encoding.UTF8.GetBytes(postData);

                    var request = (HttpWebRequest)WebRequest.Create(url);
                    request.Method = "POST";
                    request.ContentType = "application/x-www-form-urlencoded";
                    request.ContentLength = dataBytes.Length;
                    request.Timeout = 300000;

                    using (var stream = request.GetRequestStream())
                    {
                        stream.Write(dataBytes, 0, dataBytes.Length);
                    }

                    using (var resp = (HttpWebResponse)request.GetResponse())
                    using (var reader = new StreamReader(resp.GetResponseStream()))
                    {
                        statusCode = (int)resp.StatusCode;
                        response = reader.ReadToEnd();
                        success = resp.StatusCode == HttpStatusCode.OK;
                    }
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(videoPathOrUrl) || !File.Exists(videoPathOrUrl))
                    {
                        response = "Video file not found: " + videoPathOrUrl;
                        return;
                    }

                    string boundary = "----" + DateTime.Now.Ticks.ToString("x");

                    var request = (HttpWebRequest)WebRequest.Create(url);
                    request.Method = "POST";
                    request.ContentType = "multipart/form-data; boundary=" + boundary;
                    request.Timeout = 300000;

                    using (var ms = new MemoryStream())
                    {
                        byte[] boundaryBytes = Encoding.UTF8.GetBytes("\r\n--" + boundary + "\r\n");

                        // description
                        ms.Write(boundaryBytes, 0, boundaryBytes.Length);
                        string descHeader = "Content-Disposition: form-data; name=\"description\"\r\n\r\n" + (description ?? "");
                        ms.Write(Encoding.UTF8.GetBytes(descHeader), 0, Encoding.UTF8.GetByteCount(descHeader));

                        // access token
                        ms.Write(boundaryBytes, 0, boundaryBytes.Length);
                        string tokenHeader = "Content-Disposition: form-data; name=\"access_token\"\r\n\r\n" + (pageAccessToken ?? "");
                        ms.Write(Encoding.UTF8.GetBytes(tokenHeader), 0, Encoding.UTF8.GetByteCount(tokenHeader));

                        // video file
                        ms.Write(boundaryBytes, 0, boundaryBytes.Length);
                        string fileHeader = $"Content-Disposition: form-data; name=\"source\"; filename=\"{Path.GetFileName(videoPathOrUrl)}\"\r\n";
                        fileHeader += "Content-Type: video/mp4\r\n\r\n";
                        ms.Write(Encoding.UTF8.GetBytes(fileHeader), 0, Encoding.UTF8.GetByteCount(fileHeader));

                        byte[] videoBytes = File.ReadAllBytes(videoPathOrUrl);
                        ms.Write(videoBytes, 0, videoBytes.Length);

                        // end boundary
                        byte[] endBoundary = Encoding.UTF8.GetBytes("\r\n--" + boundary + "--\r\n");
                        ms.Write(endBoundary, 0, endBoundary.Length);

                        request.ContentLength = ms.Length;
                        ms.Position = 0;

                        using (var stream = request.GetRequestStream())
                        {
                            ms.CopyTo(stream);
                        }
                    }

                    using (var resp = (HttpWebResponse)request.GetResponse())
                    using (var reader = new StreamReader(resp.GetResponseStream()))
                    {
                        statusCode = (int)resp.StatusCode;
                        response = reader.ReadToEnd();
                        success = resp.StatusCode == HttpStatusCode.OK;
                    }
                }
            }
            catch (WebException ex)
            {
                HandleWebException(ex, out statusCode, out response);
            }
            catch (Exception ex)
            {
                response = ex.Message + (ex.InnerException != null ? " | Inner: " + ex.InnerException.Message : "");
            }
        }

        /// <summary>
        /// Posts multiple photos in a single post to a Facebook Page.
        ///
        /// ✅ GeneXus-friendly: accepts object so GX can pass GxSimpleCollection<string>.
        /// Supports:
        /// - GxSimpleCollection<string>
        /// - string[]
        /// - List<string>
        /// - IEnumerable
        /// - single string
        /// </summary>
        // Overload for GeneXus when it passes Object (e.g. GxSimpleCollection<string>)
        public void PostMultiplePhotos(
            string pageId,
            string pageAccessToken,
            object imagePathsOrUrls,
            string message,
            out bool success,
            out int statusCode,
            out string response
        )
        {
            var images = ToStringList(imagePathsOrUrls);
            PostMultiplePhotos(pageId, pageAccessToken, images, message, out success, out statusCode, out response);
        }

        // Overload for GeneXus when it passes string[]
        public void PostMultiplePhotos(
            string pageId,
            string pageAccessToken,
            string[] imagePathsOrUrls,
            string message,
            out bool success,
            out int statusCode,
            out string response
        )
        {
            // Delegate to the List<string> version
            var list = new List<string>();
            if (imagePathsOrUrls != null)
                list.AddRange(imagePathsOrUrls);

            PostMultiplePhotos(pageId, pageAccessToken, list, message, out success, out statusCode, out response);
        }

        public void PostMultiplePhotos(
            string pageId,
            string pageAccessToken,
            List<string> imagePathsOrUrls,
            string message,
            out bool success,
            out int statusCode,
            out string response
        )
        {
            success = false;
            statusCode = 0;
            response = "";

            try
            {
                var images = ToStringList(imagePathsOrUrls);

                // If no images, fall back to a simple text post
                if (images.Count == 0)
                {
                    PostToPage(pageId, pageAccessToken, message, out success, out statusCode, out response);
                    return;
                }

                var mediaIds = new List<string>();

                // Step 1: Upload each photo without publishing
                foreach (var imagePath in images)
                {
                    if (string.IsNullOrWhiteSpace(imagePath))
                        continue;

                    bool isUrl = IsHttpUrl(imagePath);
                    string uploadUrl = $"https://graph.facebook.com/v19.0/{pageId}/photos";
                    string uploadResponse;

                    if (isUrl)
                    {
                        // Upload photo from URL without publishing
                        string postData =
                            "url=" + Uri.EscapeDataString(imagePath) +
                            "&published=false" +
                            "&access_token=" + Uri.EscapeDataString(pageAccessToken ?? "");

                        byte[] dataBytes = Encoding.UTF8.GetBytes(postData);

                        var request = (HttpWebRequest)WebRequest.Create(uploadUrl);
                        request.Method = "POST";
                        request.ContentType = "application/x-www-form-urlencoded";
                        request.ContentLength = dataBytes.Length;

                        using (var stream = request.GetRequestStream())
                        {
                            stream.Write(dataBytes, 0, dataBytes.Length);
                        }

                        using (var resp = (HttpWebResponse)request.GetResponse())
                        using (var reader = new StreamReader(resp.GetResponseStream()))
                        {
                            uploadResponse = reader.ReadToEnd();
                        }
                    }
                    else
                    {
                        // Upload local file without publishing
                        if (!File.Exists(imagePath))
                        {
                            response = "Image file not found: " + imagePath;
                            return;
                        }

                        string boundary = "----" + DateTime.Now.Ticks.ToString("x");

                        var request = (HttpWebRequest)WebRequest.Create(uploadUrl);
                        request.Method = "POST";
                        request.ContentType = "multipart/form-data; boundary=" + boundary;

                        using (var ms = new MemoryStream())
                        {
                            byte[] boundaryBytes = Encoding.UTF8.GetBytes("\r\n--" + boundary + "\r\n");

                            // published=false
                            ms.Write(boundaryBytes, 0, boundaryBytes.Length);
                            string publishedHeader = "Content-Disposition: form-data; name=\"published\"\r\n\r\nfalse";
                            ms.Write(Encoding.UTF8.GetBytes(publishedHeader), 0, Encoding.UTF8.GetByteCount(publishedHeader));

                            // access token
                            ms.Write(boundaryBytes, 0, boundaryBytes.Length);
                            string tokenHeader = "Content-Disposition: form-data; name=\"access_token\"\r\n\r\n" + (pageAccessToken ?? "");
                            ms.Write(Encoding.UTF8.GetBytes(tokenHeader), 0, Encoding.UTF8.GetByteCount(tokenHeader));

                            // file
                            ms.Write(boundaryBytes, 0, boundaryBytes.Length);
                            string fileHeader = $"Content-Disposition: form-data; name=\"source\"; filename=\"{Path.GetFileName(imagePath)}\"\r\n";
                            fileHeader += "Content-Type: application/octet-stream\r\n\r\n";
                            ms.Write(Encoding.UTF8.GetBytes(fileHeader), 0, Encoding.UTF8.GetByteCount(fileHeader));

                            byte[] imageBytes = File.ReadAllBytes(imagePath);
                            ms.Write(imageBytes, 0, imageBytes.Length);

                            // end boundary
                            byte[] endBoundary = Encoding.UTF8.GetBytes("\r\n--" + boundary + "--\r\n");
                            ms.Write(endBoundary, 0, endBoundary.Length);

                            request.ContentLength = ms.Length;
                            ms.Position = 0;

                            using (var stream = request.GetRequestStream())
                            {
                                ms.CopyTo(stream);
                            }
                        }

                        using (var resp = (HttpWebResponse)request.GetResponse())
                        using (var reader = new StreamReader(resp.GetResponseStream()))
                        {
                            uploadResponse = reader.ReadToEnd();
                        }
                    }

                    // Extract media ID from response (Graph returns {"id":"..."} for unpublished photo)
                    var match = Regex.Match(uploadResponse ?? "", @"""id""\s*:\s*""(\d+)""");
                    if (match.Success)
                    {
                        mediaIds.Add(match.Groups[1].Value);
                    }
                    else
                    {
                        response = "Failed to extract media ID from upload response: " + uploadResponse;
                        return;
                    }
                }

                if (mediaIds.Count == 0)
                {
                    response = "No media IDs created (all images empty/invalid?)";
                    return;
                }

                // Step 2: Create feed post with all attached media
                string feedUrl = $"https://graph.facebook.com/v19.0/{pageId}/feed";

                var postDataBuilder = new StringBuilder();
                postDataBuilder.Append("message=" + Uri.EscapeDataString(message ?? ""));

                for (int i = 0; i < mediaIds.Count; i++)
                {
                    postDataBuilder.Append($"&attached_media[{i}]={{\"media_fbid\":\"{mediaIds[i]}\"}}");
                }

                postDataBuilder.Append("&access_token=" + Uri.EscapeDataString(pageAccessToken ?? ""));

                byte[] feedDataBytes = Encoding.UTF8.GetBytes(postDataBuilder.ToString());

                var feedRequest = (HttpWebRequest)WebRequest.Create(feedUrl);
                feedRequest.Method = "POST";
                feedRequest.ContentType = "application/x-www-form-urlencoded";
                feedRequest.ContentLength = feedDataBytes.Length;

                using (var stream = feedRequest.GetRequestStream())
                {
                    stream.Write(feedDataBytes, 0, feedDataBytes.Length);
                }

                using (var resp = (HttpWebResponse)feedRequest.GetResponse())
                using (var reader = new StreamReader(resp.GetResponseStream()))
                {
                    statusCode = (int)resp.StatusCode;
                    response = reader.ReadToEnd();
                    success = resp.StatusCode == HttpStatusCode.OK;
                }
            }
            catch (WebException ex)
            {
                HandleWebException(ex, out statusCode, out response);
            }
            catch (Exception ex)
            {
                response = ex.Message + (ex.InnerException != null ? " | Inner: " + ex.InnerException.Message : "");
            }
        }

        // ============================
        // GX-Compatibility helpers
        // ============================

        /// <summary>
        /// Converts GeneXus collections (GxSimpleCollection<string>) or arrays/lists/enumerables into List<string>.
        /// This avoids InvalidCastException when GX passes object types to .NET.
        /// </summary>
        private List<string> ToStringList(object value)
        {
            var result = new List<string>();
            if (value == null) return result;

            // string[]
            if (value is string[] arr)
            {
                result.AddRange(arr);
                return result;
            }

            // IEnumerable<string>
            if (value is IEnumerable<string> enumerableString)
            {
                foreach (var s in enumerableString)
                {
                    if (!string.IsNullOrWhiteSpace(s))
                        result.Add(s);
                }
                return result;
            }

            // non-generic IEnumerable (GeneXus collections often hit this path)
            if (value is System.Collections.IEnumerable enumerable)
            {
                foreach (var item in enumerable)
                {
                    if (item == null) continue;
                    var s = item.ToString();
                    if (!string.IsNullOrWhiteSpace(s))
                        result.Add(s);
                }
                return result;
            }

            // single string
            if (value is string single)
            {
                if (!string.IsNullOrWhiteSpace(single))
                    result.Add(single);
                return result;
            }

            // last resort
            var fallback = value.ToString();
            if (!string.IsNullOrWhiteSpace(fallback))
                result.Add(fallback);

            return result;
        }

        private static bool IsHttpUrl(string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return false;
            return value.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
                   value.StartsWith("https://", StringComparison.OrdinalIgnoreCase);
        }

        private static void HandleWebException(WebException ex, out int statusCode, out string response)
        {
            statusCode = 0;
            response = ex.Message + (ex.InnerException != null ? " | Inner: " + ex.InnerException.Message : "");

            if (ex.Response is HttpWebResponse errorResp)
            {
                statusCode = (int)errorResp.StatusCode;
                using var reader = new StreamReader(errorResp.GetResponseStream());
                response = reader.ReadToEnd();
            }
        }
    }
}
