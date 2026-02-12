using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;

namespace InstagramPublisher
{
    /// <summary>
    /// Instagram Graph API Publisher - Stateless implementation for GeneXus external objects
    /// </summary>
    public class InstagramPublisher
    {
        private const string BASE_URL = "https://graph.facebook.com";
        private const string DEFAULT_API_VERSION = "v24.0";

        #region Image Posts

        /// <summary>
        /// Publish a single image post to Instagram
        /// </summary>
        public void PublishImage(string instagramAccountId, string accessToken, string imageUrl, string caption, out bool success, out int statusCode, out string response)
        {
            try
            {
                // Step 1: Create container
                string creationId = CreateImageContainer(instagramAccountId, accessToken, imageUrl, caption);

                // Step 2: Publish
                string mediaId = PublishContainer(instagramAccountId, accessToken, creationId);
                
                success = true;
                statusCode = 200;
                response = JsonSerializer.Serialize(new { success = true, media_id = mediaId });
            }
            catch (Exception ex)
            {
                success = false;
                statusCode = 500;
                response = BuildErrorResponse(ex);
            }
        }

        /// <summary>
        /// Create image container (Step 1)
        /// </summary>
        private string CreateImageContainer(string instagramAccountId, string accessToken, string imageUrl, string caption)
        {
            var payload = new
            {
                image_url = imageUrl,
                caption = caption
            };

            return CreateMediaContainer(instagramAccountId, accessToken, payload);
        }

        #endregion

        #region Video Posts

        /// <summary>
        /// Publish a video post to Instagram (videos are posted as reels shared to feed)
        /// </summary>
        public void PublishVideo(string instagramAccountId, string accessToken, string videoUrl, string caption, out bool success, out int statusCode, out string response, int maxWaitSeconds = 300)
        {
            try
            {
                // Step 1: Create container (using REELS media type as VIDEO is deprecated)
                string creationId = CreateVideoContainer(instagramAccountId, accessToken, videoUrl, caption);

                // Step 2: Wait for processing
                WaitForVideoProcessing(instagramAccountId, accessToken, creationId, maxWaitSeconds);

                // Step 3: Publish
                string mediaId = PublishContainer(instagramAccountId, accessToken, creationId);
                
                success = true;
                statusCode = 200;
                response = JsonSerializer.Serialize(new { success = true, media_id = mediaId });
            }
            catch (Exception ex)
            {
                success = false;
                statusCode = 500;
                response = BuildErrorResponse(ex);
            }
        }

        /// <summary>
        /// Create video container (Step 1) - uses REELS type with share_to_feed=true
        /// </summary>
        private string CreateVideoContainer(string instagramAccountId, string accessToken, string videoUrl, string caption)
        {
            var payload = new
            {
                media_type = "REELS",
                video_url = videoUrl,
                caption = caption,
                share_to_feed = true
            };

            return CreateMediaContainer(instagramAccountId, accessToken, payload);
        }

        #endregion

        #region Reels

        /// <summary>
        /// Publish a reel to Instagram
        /// </summary>
        public void PublishReel(string instagramAccountId, string accessToken, string videoUrl, string caption, bool shareToFeed, out bool success, out int statusCode, out string response, int maxWaitSeconds = 300)
        {
            try
            {
                // Step 1: Create container
                string creationId = CreateReelContainer(instagramAccountId, accessToken, videoUrl, caption, shareToFeed);

                // Step 2: Wait for processing
                WaitForVideoProcessing(instagramAccountId, accessToken, creationId, maxWaitSeconds);

                // Step 3: Publish
                string mediaId = PublishContainer(instagramAccountId, accessToken, creationId);
                
                success = true;
                statusCode = 200;
                response = JsonSerializer.Serialize(new { success = true, media_id = mediaId });
            }
            catch (Exception ex)
            {
                success = false;
                statusCode = 500;
                response = BuildErrorResponse(ex);
            }
        }

        /// <summary>
        /// Create reel container (Step 1)
        /// </summary>
        private string CreateReelContainer(string instagramAccountId, string accessToken, string videoUrl, string caption, bool shareToFeed = true)
        {
            var payload = new
            {
                media_type = "REELS",
                video_url = videoUrl,
                caption = caption,
                share_to_feed = shareToFeed
            };

            return CreateMediaContainer(instagramAccountId, accessToken, payload);
        }

        #endregion

        #region Storage

        /// <summary>
        /// Publish an image story to Instagram
        /// </summary>
        public void PublishImageStory(string instagramAccountId, string accessToken, string imageUrl, out bool success, out int statusCode, out string response)
        {
            try
            {
                var payload = new
                {
                    image_url = imageUrl,
                    media_type = "STORIES"
                };

                // Stories publish immediately, no second step needed
                string storyId = CreateMediaContainer(instagramAccountId, accessToken, payload);
                
                success = true;
                statusCode = 200;
                response = JsonSerializer.Serialize(new { success = true, story_id = storyId });
            }
            catch (Exception ex)
            {
                success = false;
                statusCode = 500;
                response = BuildErrorResponse(ex);
            }
        }

        /// <summary>
        /// Publish a video story to Instagram
        /// </summary>
        public void PublishVideoStory(string instagramAccountId, string accessToken, string videoUrl, out bool success, out int statusCode, out string response)
        {
            try
            {
                var payload = new
                {
                    video_url = videoUrl,
                    media_type = "STORIES"
                };

                // Stories publish immediately
                string storyId = CreateMediaContainer(instagramAccountId, accessToken, payload);
                
                success = true;
                statusCode = 200;
                response = JsonSerializer.Serialize(new { success = true, story_id = storyId });
            }
            catch (Exception ex)
            {
                success = false;
                statusCode = 500;
                response = BuildErrorResponse(ex);
            }
        }

        #endregion

        #region Carousel Posts

        /// <summary>
        /// Publish a carousel post with multiple images
        /// </summary>
        /// <param name="imageUrls">List of image URLs (2-10 URLs)</param>
        public void PublishCarousel(string instagramAccountId, string accessToken, List<string> imageUrls, string caption, out bool success, out int statusCode, out string response)
        {
            try
            {
                if (imageUrls == null || imageUrls.Count < 2 || imageUrls.Count > 10)
                    throw new ArgumentException("Carousel requires 2-10 images", nameof(imageUrls));

                // Step 1: Create item containers
                string[] itemIds = new string[imageUrls.Count];
                for (int i = 0; i < imageUrls.Count; i++)
                {
                    itemIds[i] = CreateCarouselItem(instagramAccountId, accessToken, imageUrls[i]);
                }

                // Step 2: Create carousel container
                string carouselId = CreateCarouselContainer(instagramAccountId, accessToken, itemIds, caption);

                // Step 3: Publish
                string mediaId = PublishContainer(instagramAccountId, accessToken, carouselId);
                
                success = true;
                statusCode = 200;
                response = JsonSerializer.Serialize(new { success = true, media_id = mediaId });
            }
            catch (Exception ex)
            {
                success = false;
                statusCode = 500;
                response = BuildErrorResponse(ex);
            }
        }

        /// <summary>
        /// Create a single carousel item
        /// </summary>
        private string CreateCarouselItem(string instagramAccountId, string accessToken, string imageUrl)
        {
            var payload = new
            {
                image_url = imageUrl,
                is_carousel_item = true
            };

            return CreateMediaContainer(instagramAccountId, accessToken, payload);
        }

        /// <summary>
        /// Create carousel container with items
        /// </summary>
        private string CreateCarouselContainer(string instagramAccountId, string accessToken, string[] itemIds, string caption)
        {
            var payload = new
            {
                media_type = "CAROUSEL",
                caption = caption,
                children = itemIds
            };

            return CreateMediaContainer(instagramAccountId, accessToken, payload);
        }

        #endregion

        #region Helper Methods

        /// <summary>
        /// Create media container (generic method)
        /// </summary>
        private string CreateMediaContainer(string instagramAccountId, string accessToken, object payload)
        {
            string url = $"{BASE_URL}/{DEFAULT_API_VERSION}/{instagramAccountId}/media";
            string response = PostRequest(accessToken, url, payload);
            
            using (JsonDocument json = JsonDocument.Parse(response))
            {
                if (json.RootElement.TryGetProperty("error", out JsonElement errorElement))
                {
                    string errorMessage = errorElement.GetProperty("message").GetString() ?? "Unknown error";
                    throw new Exception($"API Error: {errorMessage}");
                }

                if (json.RootElement.TryGetProperty("id", out JsonElement idElement))
                {
                    return idElement.GetString() ?? throw new Exception("No creation ID returned");
                }
                
                throw new Exception("No creation ID returned");
            }
        }

        /// <summary>
        /// Publish a media container
        /// </summary>
        private string PublishContainer(string instagramAccountId, string accessToken, string creationId)
        {
            string url = $"{BASE_URL}/{DEFAULT_API_VERSION}/{instagramAccountId}/media_publish";
            
            var payload = new
            {
                creation_id = creationId
            };

            string response = PostRequest(accessToken, url, payload);
            
            using (JsonDocument json = JsonDocument.Parse(response))
            {
                if (json.RootElement.TryGetProperty("error", out JsonElement errorElement))
                {
                    string errorMessage = errorElement.GetProperty("message").GetString() ?? "Unknown error";
                    throw new Exception($"Publish Error: {errorMessage}");
                }

                if (json.RootElement.TryGetProperty("id", out JsonElement idElement))
                {
                    return idElement.GetString() ?? throw new Exception("No media ID returned");
                }
                
                throw new Exception("No media ID returned");
            }
        }

        /// <summary>
        /// Check video/reel processing status
        /// </summary>
        public string GetContainerStatus(string instagramAccountId, string accessToken, string creationId)
        {
            string url = $"{BASE_URL}/{DEFAULT_API_VERSION}/{creationId}?fields=status_code&access_token={accessToken}";
            string response = GetRequest(url);
            
            using (JsonDocument json = JsonDocument.Parse(response))
            {
                if (json.RootElement.TryGetProperty("error", out JsonElement errorElement))
                {
                    string errorMessage = errorElement.GetProperty("message").GetString() ?? "Unknown error";
                    throw new Exception($"Status Error: {errorMessage}");
                }

                if (json.RootElement.TryGetProperty("status_code", out JsonElement statusElement))
                {
                    return statusElement.GetString() ?? "UNKNOWN";
                }
                
                return "UNKNOWN";
            }
        }

        /// <summary>
        /// Wait for video/reel to finish processing
        /// </summary>
        private void WaitForVideoProcessing(string instagramAccountId, string accessToken, string creationId, int maxWaitSeconds)
        {
            int elapsed = 0;
            int pollInterval = 5; // Check every 5 seconds

            while (elapsed < maxWaitSeconds)
            {
                string status = GetContainerStatus(instagramAccountId, accessToken, creationId);

                if (status == "FINISHED")
                    return;

                if (status == "ERROR")
                    throw new Exception("Video processing failed");

                Thread.Sleep(pollInterval * 1000);
                elapsed += pollInterval;
            }

            throw new TimeoutException($"Video processing timed out after {maxWaitSeconds} seconds");
        }

        /// <summary>
        /// Make POST request
        /// </summary>
        private string PostRequest(string accessToken, string url, object payload)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                string jsonPayload = JsonSerializer.Serialize(payload);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var task = client.PostAsync(url, content);
                task.Wait();
                var response = task.Result;

                var readTask = response.Content.ReadAsStringAsync();
                readTask.Wait();
                return readTask.Result;
            }
        }

        /// <summary>
        /// Make GET request
        /// </summary>
        private string GetRequest(string url)
        {
            using (var client = new HttpClient())
            {
                var task = client.GetStringAsync(url);
                task.Wait();
                return task.Result;
            }
        }

        #endregion

        #region Utility Methods

        /// <summary>
        /// Get Instagram Business Account info
        /// </summary>
        public void GetAccountInfo(string instagramAccountId, string accessToken, out bool success, out int statusCode, out string response)
        {
            try
            {
                string url = $"{BASE_URL}/{DEFAULT_API_VERSION}/{instagramAccountId}?fields=id,username,name,profile_picture_url&access_token={accessToken}";
                string result = GetRequest(url);
                
                success = true;
                statusCode = 200;
                response = result;
            }
            catch (Exception ex)
            {
                success = false;
                statusCode = 500;
                response = BuildErrorResponse(ex);
            }
        }

        /// <summary>
        /// Get media info by ID
        /// </summary>
        public void GetMediaInfo(string instagramAccountId, string accessToken, string mediaId, out bool success, out int statusCode, out string response)
        {
            try
            {
                string url = $"{BASE_URL}/{DEFAULT_API_VERSION}/{mediaId}?fields=id,caption,media_type,media_url,permalink,timestamp&access_token={accessToken}";
                string result = GetRequest(url);
                
                success = true;
                statusCode = 200;
                response = result;
            }
            catch (Exception ex)
            {
                success = false;
                statusCode = 500;
                response = BuildErrorResponse(ex);
            }
        }

        #endregion

        #region Response Helpers

        /// <summary>
        /// Build error response with nested exception details
        /// </summary>
        private string BuildErrorResponse(Exception ex)
        {
            var errorMessage = BuildErrorMessage(ex);
            return JsonSerializer.Serialize(new { success = false, error = errorMessage });
        }

        /// <summary>
        /// Build error message from exception chain
        /// </summary>
        private string BuildErrorMessage(Exception ex)
        {
            var messages = new System.Collections.Generic.List<string>();
            var current = ex;

            while (current != null)
            {
                messages.Add(current.Message);
                current = current.InnerException;
            }

            return string.Join(" -> ", messages);
        }

        #endregion
    }
}
