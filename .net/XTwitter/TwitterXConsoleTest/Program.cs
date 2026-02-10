using System;
using System.Collections.Generic;
using XTwitterSdk;

class Program
{
    static void Main()
    {
        var client = new XTwitterClient();

        bool success;
        int statusCode;
        string response;

        // TODO: Replace with the actual paths to your images
        var imagePaths = new List<string>
        {
            "https://picsum.photos/1024/512",
            "https://picsum.photos/1024/512",
            "https://picsum.photos/1024/512",
            "https://picsum.photos/1024/512"
        };

        client.PostTweetWithImageUrls(
            "5skp2K08Y8AHrd1hHWAIbi66s",
            "q5XyXaMFNAAgYiRmyRLMcEWi6NzMKESVzwSiaJQA8vHOm05HZ2",
            "1489624681493716994-HoFduhQrc3APO9uljTW8nD0xdD5INh",
            "IoSlywXWCK0nBLLU5WaH3gjroDnCNTRC8bEBew7AEimOk",
            "Hello X! Success/error test 🚀 " + DateTime.Now,
            imagePaths,
            out success,
            out statusCode,
            out response
        );

        // Video tweet example (disabled for now)
        // var videoPaths = new List<string>
        // {
        //     "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
        // };
        // client.PostTweetWithVideoUrls(
        //     "Mu4mj2jjsFXqJf6SJKGfNoWST",
        //     "yEOk6oOmjeMJlMD3yYKjcI27Pxas1PZuaKd9wMZpILDeHY9zD6",
        //     "1489624681493716994-NdzctXLzgHXUNnVToa6PuTCYeQ0GHB",
        //     "Ssfwmt10Siq3yiUIL4JXohhDzZ97vu4ebX62Kzjm4EqEa",
        //     "Hello X! Video test 🎬 " + DateTime.Now,
        //     videoPaths,
        //     out success,
        //     out statusCode,
        //     out response
        // );

        // Delete tweet example (fill in an existing tweet ID first)
        // var tweetIdToDelete = "2019347227383120033"; // example
        // client.DeleteTweet(
        //     "Mu4mj2jjsFXqJf6SJKGfNoWST",
        //     "yEOk6oOmjeMJlMD3yYKjcI27Pxas1PZuaKd9wMZpILDeHY9zD6",
        //     "1489624681493716994-NdzctXLzgHXUNnVToa6PuTCYeQ0GHB",
        //     "Ssfwmt10Siq3yiUIL4JXohhDzZ97vu4ebX62Kzjm4EqEa",
        //     tweetIdToDelete,
        //     out success,
        //     out statusCode,
        //     out response
        // );


        Console.WriteLine($"Success: {success}");
        Console.WriteLine($"StatusCode: {statusCode}");
        Console.WriteLine("Response:");
        Console.WriteLine(response);

        Console.ReadKey();
    }
}
