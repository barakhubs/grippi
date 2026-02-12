# Instagram Publisher - .NET Class Library

A synchronous .NET class library for publishing content to Instagram using the Instagram Graph API. Designed for use with GeneXus external objects.

## Features

- ✅ Publish Images
- ✅ Publish Videos
- ✅ Publish Reels
- ✅ Publish Stories (Image & Video)
- ✅ Publish Carousel Posts
- ✅ Fully synchronous (no async/await)
- ✅ Easy to use with GeneXus external objects

## Prerequisites

- Instagram Business or Creator Account
- Facebook Page linked to Instagram account
- Facebook App with Instagram permissions
- Page Access Token with:
  - `instagram_basic`
  - `instagram_content_publish`
  - `pages_read_engagement`

## Installation

### Build the Class Library

```bash
cd InstagramPublisher
dotnet build
```

The compiled DLL will be in: `InstagramPublisher/bin/Debug/net6.0/InstagramPublisher.dll`

### Reference in Your Project

Add reference to `InstagramPublisher.dll` in your .NET project or GeneXus external object.

## Usage

### 1. Initialize the Publisher

```csharp
using InstagramPublisher;

string instagramAccountId = "17841480212587776";
string accessToken = "YOUR_PAGE_ACCESS_TOKEN";

var publisher = new InstagramPublisher(instagramAccountId, accessToken);
```

### 2. Publish an Image

```csharp
string imageUrl = "https://example.com/image.jpg";
string caption = "Check out this amazing photo! #instagram #api";

string mediaId = publisher.PublishImage(imageUrl, caption);
Console.WriteLine($"Published! Media ID: {mediaId}");
```

### 3. Publish a Video

```csharp
string videoUrl = "https://example.com/video.mp4";
string caption = "Watch this cool video!";

// This will wait for video processing before publishing
string mediaId = publisher.PublishVideo(videoUrl, caption);
```

### 4. Publish a Reel

```csharp
string reelUrl = "https://example.com/reel.mp4";
string caption = "My first reel!";
bool shareToFeed = true;

string reelId = publisher.PublishReel(reelUrl, caption, shareToFeed);
```

### 5. Publish an Image Story

```csharp
string storyUrl = "https://example.com/story.jpg";
string storyId = publisher.PublishImageStory(storyUrl);
```

### 6. Publish a Video Story

```csharp
string storyVideoUrl = "https://example.com/story-video.mp4";
string storyId = publisher.PublishVideoStory(storyVideoUrl);
```

### 7. Publish a Carousel

```csharp
string[] imageUrls = new string[]
{
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
};
string caption = "Swipe to see more!";

string carouselId = publisher.PublishCarousel(imageUrls, caption);
```

## Advanced Usage

### Manual Container Creation and Publishing

```csharp
// Step 1: Create container
string creationId = publisher.CreateImageContainer(imageUrl, caption);

// Step 2: Publish container
string mediaId = publisher.PublishContainer(creationId);
```

### Check Video Processing Status

```csharp
string creationId = publisher.CreateVideoContainer(videoUrl, caption);
string status = publisher.GetContainerStatus(creationId);

if (status == "FINISHED")
{
    string mediaId = publisher.PublishContainer(creationId);
}
```

### Get Account Information

```csharp
string accountInfo = publisher.GetAccountInfo();
Console.WriteLine(accountInfo);
```

### Get Media Information

```csharp
string mediaInfo = publisher.GetMediaInfo("MEDIA_ID");
Console.WriteLine(mediaInfo);
```

## Media Requirements

### Images
- Format: JPG, PNG, WEBP
- Max size: 8MB
- Min resolution: 320px
- Aspect ratio: 4:5 to 1.91:1

### Videos
- Format: MP4, MOV
- Max size: 100MB
- Max duration: 60 seconds (feed), 90 seconds (reels)
- Min resolution: 720px

### Reels
- Duration: 4-90 seconds
- Aspect ratio: 9:16 recommended
- Resolution: 1080x1920 recommended

### Stories
- Duration: Up to 60 seconds for video
- Aspect ratio: 9:16 recommended

### Carousel
- 2-10 images
- All images must meet image requirements

## Important Notes

### Media URLs Must Be:
- Publicly accessible (no authentication required)
- HTTPS only
- Direct links (no redirects)
- Fully qualified URLs

### API Limitations
- Rate limits apply (varies by account)
- Videos/Reels require processing time
- Stories expire after 24 hours
- Text-only posts are not supported

## Testing the Console Application

### Update Configuration

Edit `Program.cs` in the console test project:

```csharp
string instagramAccountId = "YOUR_INSTAGRAM_ACCOUNT_ID";
string accessToken = "YOUR_ACCESS_TOKEN";
```

### Run Tests

```bash
cd InstagramPublisher.ConsoleTest
dotnet run
```

The console app provides an interactive menu to test all features.

## GeneXus Integration

### 1. Add DLL Reference
- Add `InstagramPublisher.dll` as external object
- Also reference `Newtonsoft.Json.dll`

### 2. Create External Object in GeneXus

```
External Object: InstagramPublisher
  Properties:
    - None (stateless)
  
  Methods:
    - PublishImage(in:&InstagramAccountId, in:&AccessToken, in:&ImageUrl, in:&Caption, out:&MediaId)
    - PublishVideo(in:&InstagramAccountId, in:&AccessToken, in:&VideoUrl, in:&Caption, out:&MediaId)
    - PublishReel(in:&InstagramAccountId, in:&AccessToken, in:&VideoUrl, in:&Caption, in:&ShareToFeed, out:&ReelId)
    - etc.
```

### 3. Use in GeneXus Procedure

```
// Publish image from GeneXus
&Publisher.New(&InstagramAccountId, &AccessToken)
&MediaId = &Publisher.PublishImage(&ImageUrl, &Caption)
msg("Published! ID: " + &MediaId)
```

## Error Handling

All methods throw exceptions on error. Wrap calls in try-catch:

```csharp
try
{
    string mediaId = publisher.PublishImage(imageUrl, caption);
}
catch (Exception ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}
```

## API Version

Current API version: `v24.0` (customizable in constructor)

```csharp
var publisher = new InstagramPublisher(accountId, token, "v25.0");
```

## License

MIT License - Free to use in commercial and personal projects.

## Support

For issues with:
- **This library**: Check error messages and media requirements
- **Instagram API**: See https://developers.facebook.com/docs/instagram-api
- **Permissions**: Ensure your app has required Instagram permissions
- **Access tokens**: Verify token is valid and has correct scope

## Version History

- **1.0.0** - Initial release
  - Image, Video, Reel, Story, and Carousel support
  - Fully synchronous implementation
  - GeneXus-compatible
