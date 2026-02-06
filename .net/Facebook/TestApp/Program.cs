using System;
using FacebookSdk;

class Program
{
    static void Main()
    {
        var client = new FacebookClient();

        bool success;
        int statusCode;
        string response;

        // client.PostToPage(
        //     "927754980428829",
        //     "EAAMcvwdk8bwBQojf4ALZBNZBYiUoUcZAUFK6O6LsiaLXUkZCCXESZCm03ZAIzCAAvFcsutkslSI9qnk66mfzDOT9zYcXdL8yxcGEGQkFJXS4v2i2xPueiL9Oae4PgkpKnXNuFhZBDysw84zgvIeXcwobIzzqyOVLjZAybXYk5ELyynBTMdtu9bHvnZBcshtk0nWZCr2gyNSsaQb3KAozB0T4SewahLM9ZC9dLX6T2cwUZAYA",
        //     "Hello Facebook! Posted from .NET DLL 🚀 " + DateTime.Now,
        //     out success,
        //     out statusCode,
        //     out response
        // );

        // client.PostPhoto(
        //     "927754980428829",
        //     "EAAMcvwdk8bwBQkXB6nZBjZAfiqZAZA72tPg9lZBAV0RKzYY9lb791sRLQqkTA0TnDEpb2c7qA0XsWgvGKFjREELGLARqtFXmUpLTS6B3jbMimP2PTIAd2KuKZCLLdosUvqAh3c7FYg9axuss2Y8YMl9K1Hn5soZB0s8qU6v6kFg5MJ4DvPZAeqT6pLWAFqdxsmG2KYDhXy917qQ1yoraBZCbfnC9RIOFpa9oxYiYaTVmbJzEZD",
        //     "https://uce62d6479af616d64848cb3f579.dl.dropboxusercontent.com/cd/0/inline/C6Qvhd8B5kI5Wc1ZqANnWEh_iQ-4mv4x5c5sx8ibZW82hB25RgnK6j8zpVdlYAzD3shaNCEvOlU8I4OvtyPtiYJ5vYNuUF3L0zpcavVDWcnbz-MuasquJF5F2TS4hEuIDIlFT6eq5ISLpBANPlKZauCX/file#",
        //     "Check out this photo! 📸",
        //     out success,
        //     out statusCode,
        //     out response
        // );

        // Example: Post multiple photos in one post
        // string[] multipleImages = new string[]
        // {
        //     "https://picsum.photos/800/600?random=1",
        //     "https://picsum.photos/800/600?random=2",
        //     "https://picsum.photos/800/600?random=3",
        //     @"C:\path\to\local\image.jpg"  // Can mix URLs and local files
        // };
        // client.PostMultiplePhotos(
        //     "927754980428829",
        //     "YOUR_ACCESS_TOKEN",
        //     multipleImages,
        //     "Check out these amazing photos! 📸✨ " + DateTime.Now,
        //     out success,
        //     out statusCode,
        //     out response
        // );

        // client.PostVideo(
        //     "927754980428829",
        //     "EAAMcvwdk8bwBQkXB6nZBjZAfiqZAZA72tPg9lZBAV0RKzYY9lb791sRLQqkTA0TnDEpb2c7qA0XsWgvGKFjREELGLARqtFXmUpLTS6B3jbMimP2PTIAd2KuKZCLLdosUvqAh3c7FYg9axuss2Y8YMl9K1Hn5soZB0s8qU6v6kFg5MJ4DvPZAeqT6pLWAFqdxsmG2KYDhXy917qQ1yoraBZCbfnC9RIOFpa9oxYiYaTVmbJzEZD",
        //     "https://www.dropbox.com/scl/fi/4zlbf0ugk8whgjpeusahx/69526-531102354_small.mp4?rlkey=2gb3hhsv88khpnha5qx0m3buq&dl=0&raw=1",
        //     "My awesome video! 🎥",
        //     out success,
        //     out statusCode,
        //     out response
        // );
        var imagePaths = new List<string>
        {
            "https://www.dropbox.com/scl/fi/q2byvd5ht3k4rf0gogogo/Mountain-Landscape.jpg?rlkey=0e4uggkkl9ibkg47ysaqxhd04&dl=0&raw=1"
        };
        Console.WriteLine("Success: " + imagePaths);
        client.PostMultiplePhotos(
            "927754980428829",
            "EAAMcvwdk8bwBQrZBS2TuhoynPD1wJZAegkIOfSHHkm7fCr4CZAcCdZCUa5kZBJZBguKfERdsNe46eY1joqo7WCkkZCtnMrZCx7GXJFTfRdSrbgN7xwZBOzMfqoQovySqwm11dQdPT39XPLPKfiKZB9N9BDxFtp3O4M9p0tZA27kkAYnjlc4RzZB4GvMnF2m41vafCCUIkWEZCpzwsAowbppmhaCiSZCuyEXZBgGkiJAeHNzZAV4zzucZD",
            imagePaths,
            "Check out these photos! 📸",
            out success,
            out statusCode,
            out response
        );

        Console.WriteLine("Success: " + success);
        Console.WriteLine("StatusCode: " + statusCode);
        Console.WriteLine("Response:");
        Console.WriteLine(response);

        if (!success && response.Contains("inner exception"))
        {
            Console.WriteLine("\nNote: SSL errors can occur. Try using a different image URL or a local file.");
        }

        Console.ReadKey();
    }
}
