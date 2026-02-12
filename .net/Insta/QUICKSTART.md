# Quick Start Guide

## Step 1: Build the Project

### On Windows (Visual Studio):
1. Open `InstagramPublisher.sln`
2. Build → Build Solution (Ctrl+Shift+B)

### On Windows/Mac/Linux (Command Line):
```bash
dotnet build InstagramPublisher.sln --configuration Release
```

Or use the provided script:
```bash
./build.sh
```

## Step 2: Get Your Credentials

### A. Get Instagram Business Account ID

Run this curl command with your page access token:

```bash
curl -X GET \
  "https://graph.facebook.com/v24.0/YOUR_PAGE_ID?fields=instagram_business_account&access_token=YOUR_PAGE_TOKEN"
```

Response will include:
```json
{
  "instagram_business_account": {
    "id": "17841480212587776"  ← This is your Instagram Account ID
  }
}
```

### B. Get Page Access Token

1. Go to https://developers.facebook.com/tools/explorer/
2. Select your app
3. In "User or Page" dropdown, select your Facebook Page
4. Click "Generate Access Token"
5. Select permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
6. Copy the generated token

## Step 3: Test with Console App

1. Open `InstagramPublisher.ConsoleTest/Program.cs`
2. Update these lines:

```csharp
string instagramAccountId = "17841480212587776";  // Your ID from Step 2A
string accessToken = "YOUR_ACCESS_TOKEN_HERE";     // Your token from Step 2B
```

3. Run the console app:

```bash
cd InstagramPublisher.ConsoleTest
dotnet run
```

4. Choose option 1 to test publishing an image

## Step 4: Use in Your Code

```csharp
using InstagramPublisher;

// Initialize
var publisher = new InstagramPublisher(
    "17841480212587776",           // Instagram Account ID
    "YOUR_ACCESS_TOKEN"            // Page Access Token
);

// Publish an image
string mediaId = publisher.PublishImage(
    "https://example.com/image.jpg",
    "My first post via API! 🚀"
);

Console.WriteLine($"Published! ID: {mediaId}");
```

## Step 5: Use in GeneXus

### Add External Object:

1. Add reference to `InstagramPublisher.dll`
2. Add reference to `Newtonsoft.Json.dll` (from NuGet packages)
3. Create external object wrapper:

```
Object: InstagramAPI
  
Method: PublishImage
  Input:
    &InstagramAccountId (Character)
    &AccessToken (Character)
    &ImageUrl (Character)
    &Caption (Character)
  Output:
    &MediaId (Character)
  
  Source:
    &Publisher = new InstagramPublisher(&InstagramAccountId, &AccessToken)
    &MediaId = &Publisher.PublishImage(&ImageUrl, &Caption)
```

### Use in GeneXus Procedure:

```
&InstagramAccountId = "17841480212587776"
&AccessToken = "YOUR_TOKEN"
&ImageUrl = "https://yoursite.com/image.jpg"
&Caption = "Posted from GeneXus!"

&MediaId = InstagramAPI.PublishImage(&InstagramAccountId, &AccessToken, &ImageUrl, &Caption)

if &MediaId <> ""
   msg("Success! Media ID: " + &MediaId)
else
   msg("Failed to publish")
endif
```

## Common Issues

### "Cannot parse access token"
- Token expired or invalid
- Generate a new token in Graph API Explorer

### "Object does not exist"
- Wrong Instagram Account ID
- Token doesn't have Instagram permissions
- Instagram account not linked to Facebook Page

### "Media download failed"
- Image URL must be direct link (no redirects)
- Must be HTTPS
- Must be publicly accessible
- Should end in .jpg, .png, .webp

### "Unsupported post request"
- Missing permissions in access token
- Instagram account not a Business/Creator account
- Account not properly linked to Facebook Page

## Testing URLs

Safe test image URLs:
- https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1080&h=1080&fit=crop
- https://via.placeholder.com/1080.jpg
- https://dummyimage.com/1080x1080/000/fff.jpg

## Next Steps

- Read the full [README.md](README.md) for all features
- Check Instagram API documentation: https://developers.facebook.com/docs/instagram-api
- Review media requirements for different content types
- Implement error handling in your application

## Need Help?

1. Check error messages - they usually indicate the exact problem
2. Verify all media requirements are met
3. Ensure access token has correct permissions
4. Test with the console app first before integrating
