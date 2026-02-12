using System;
using System.Collections.Generic;
using InstagramPublisher;

namespace InstagramPublisher.ConsoleTest
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Instagram Publisher Test Console ===\n");

            // Configuration - REPLACE WITH YOUR VALUES
            string instagramAccountId = "17841480212587776";
            string accessToken = "EAAVIQ1otZA9oBQqZBq58AIp03St3laUHKl0HFOQdAZC4uVJ1LegRKRGRu5hZBxjZBfWpShiWqIRY87MtDs3gMET5hLVrkq3hxi3IdJZCMJahwaLfGfkbSrNiaWqTfCr9DvTp8tZAuL0p9mWzU9cvZBhiZAzZAGOnXulrtxhct7tSlZAheSMYJGcdhiOAyKNoKrjIZBXPsb0Fef6BNeRMejrfReCXmoNWwQBEzCckdEFFNaUZD";

            try
            {
                // No initialization needed - stateless API
                var publisher = new InstagramPublisher();
                Console.WriteLine("✓ Instagram Publisher ready\n");

                // Test menu
                bool exit = false;
                while (!exit)
                {
                    ShowMenu();
                    string choice = Console.ReadLine();

                    switch (choice)
                    {
                        case "1":
                            TestPublishImage(publisher, instagramAccountId, accessToken);
                            break;
                        case "2":
                            TestPublishVideo(publisher, instagramAccountId, accessToken);
                            break;
                        case "3":
                            TestPublishReel(publisher, instagramAccountId, accessToken);
                            break;
                        case "4":
                            TestPublishImageStory(publisher, instagramAccountId, accessToken);
                            break;
                        case "5":
                            TestPublishVideoStory(publisher, instagramAccountId, accessToken);
                            break;
                        case "6":
                            TestPublishCarousel(publisher, instagramAccountId, accessToken);
                            break;
                        case "7":
                            TestGetAccountInfo(publisher, instagramAccountId, accessToken);
                            break;
                        case "8":
                            TestCheckStatus(publisher, instagramAccountId, accessToken);
                            break;
                        case "0":
                            exit = true;
                            break;
                        default:
                            Console.WriteLine("Invalid option. Try again.\n");
                            break;
                    }
                }

                Console.WriteLine("\nGoodbye!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"\n✗ ERROR: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }

        static void ShowMenu()
        {
            Console.WriteLine("\n=== Test Menu ===");
            Console.WriteLine("1. Publish Image Post");
            Console.WriteLine("2. Publish Video Post");
            Console.WriteLine("3. Publish Reel");
            Console.WriteLine("4. Publish Image Story");
            Console.WriteLine("5. Publish Video Story");
            Console.WriteLine("6. Publish Carousel");
            Console.WriteLine("7. Get Account Info");
            Console.WriteLine("8. Check Container Status");
            Console.WriteLine("0. Exit");
            Console.Write("\nChoose option: ");
        }

        static void TestPublishImage(InstagramPublisher publisher, string instagramAccountId, string accessToken)
        {
            Console.WriteLine("\n--- Publish Image Test ---");
            
            Console.Write("Enter image URL: ");
            string imageUrl = Console.ReadLine();
            
            Console.Write("Enter caption: ");
            string caption = Console.ReadLine();

            Console.WriteLine("\nPublishing image...");
            publisher.PublishImage(instagramAccountId, accessToken, imageUrl, caption, out bool success, out int statusCode, out string response);
            
            if (success)
            {
                Console.WriteLine($"✓ SUCCESS! Status: {statusCode}");
                Console.WriteLine($"Response: {response}");
            }
            else
            {
                Console.WriteLine($"✗ FAILED! Status: {statusCode}");
                Console.WriteLine($"Error: {response}");
            }
        }

        static void TestPublishVideo(InstagramPublisher publisher, string instagramAccountId, string accessToken)
        {
            Console.WriteLine("\n--- Publish Video Test ---");
            
            Console.Write("Enter video URL: ");
            string videoUrl = Console.ReadLine();
            
            Console.Write("Enter caption: ");
            string caption = Console.ReadLine();

            Console.WriteLine("\nPublishing video (this may take a while)...");
            publisher.PublishVideo(instagramAccountId, accessToken, videoUrl, caption, out bool success, out int statusCode, out string response);
            
            if (success)
            {
                Console.WriteLine($"✓ SUCCESS! Status: {statusCode}");
                Console.WriteLine($"Response: {response}");
            }
            else
            {
                Console.WriteLine($"✗ FAILED! Status: {statusCode}");
                Console.WriteLine($"Error: {response}");
            }
        }

        static void TestPublishReel(InstagramPublisher publisher, string instagramAccountId, string accessToken)
        {
            Console.WriteLine("\n--- Publish Reel Test ---");
            
            Console.Write("Enter reel video URL (4-90s): ");
            string videoUrl = Console.ReadLine();
            
            Console.Write("Enter caption: ");
            string caption = Console.ReadLine();

            Console.Write("Share to feed? (y/n): ");
            bool shareToFeed = Console.ReadLine()?.ToLower() == "y";

            Console.WriteLine("\nPublishing reel (this may take a while)...");
            publisher.PublishReel(instagramAccountId, accessToken, videoUrl, caption, shareToFeed, out bool success, out int statusCode, out string response);
            
            if (success)
            {
                Console.WriteLine($"✓ SUCCESS! Status: {statusCode}");
                Console.WriteLine($"Response: {response}");
            }
            else
            {
                Console.WriteLine($"✗ FAILED! Status: {statusCode}");
                Console.WriteLine($"Error: {response}");
            }
        }

        static void TestPublishImageStory(InstagramPublisher publisher, string instagramAccountId, string accessToken)
        {
            Console.WriteLine("\n--- Publish Image Story Test ---");
            
            Console.Write("Enter story image URL: ");
            string imageUrl = Console.ReadLine();

            Console.WriteLine("\nPublishing story...");
            publisher.PublishImageStory(instagramAccountId, accessToken, imageUrl, out bool success, out int statusCode, out string response);
            
            if (success)
            {
                Console.WriteLine($"✓ SUCCESS! Status: {statusCode}");
                Console.WriteLine($"Response: {response}");
            }
            else
            {
                Console.WriteLine($"✗ FAILED! Status: {statusCode}");
                Console.WriteLine($"Error: {response}");
            }
        }

        static void TestPublishVideoStory(InstagramPublisher publisher, string instagramAccountId, string accessToken)
        {
            Console.WriteLine("\n--- Publish Video Story Test ---");
            
            Console.Write("Enter story video URL: ");
            string videoUrl = Console.ReadLine();

            Console.WriteLine("\nPublishing video story...");
            publisher.PublishVideoStory(instagramAccountId, accessToken, videoUrl, out bool success, out int statusCode, out string response);
            
            if (success)
            {
                Console.WriteLine($"✓ SUCCESS! Status: {statusCode}");
                Console.WriteLine($"Response: {response}");
            }
            else
            {
                Console.WriteLine($"✗ FAILED! Status: {statusCode}");
                Console.WriteLine($"Error: {response}");
            }
        }

        static void TestPublishCarousel(InstagramPublisher publisher, string instagramAccountId, string accessToken)
        {
            Console.WriteLine("\n--- Publish Carousel Test ---");
            
            Console.Write("How many images? (2-10): ");
            int count = int.Parse(Console.ReadLine() ?? "2");

            var imageUrls = new List<string>();
            for (int i = 0; i < count; i++)
            {
                Console.Write($"Enter image {i + 1} URL: ");
                imageUrls.Add(Console.ReadLine());
            }

            Console.Write("Enter caption: ");
            string caption = Console.ReadLine();

            Console.WriteLine("\nPublishing carousel...");
            publisher.PublishCarousel(instagramAccountId, accessToken, imageUrls, caption, out bool success, out int statusCode, out string response);
            
            if (success)
            {
                Console.WriteLine($"✓ SUCCESS! Status: {statusCode}");
                Console.WriteLine($"Response: {response}");
            }
            else
            {
                Console.WriteLine($"✗ FAILED! Status: {statusCode}");
                Console.WriteLine($"Error: {response}");
            }
        }

        static void TestGetAccountInfo(InstagramPublisher publisher, string instagramAccountId, string accessToken)
        {
            Console.WriteLine("\n--- Get Account Info ---");

            publisher.GetAccountInfo(instagramAccountId, accessToken, out bool success, out int statusCode, out string response);
            
            if (success)
            {
                Console.WriteLine($"\nAccount Info (Status: {statusCode}):");
                Console.WriteLine(response);
            }
            else
            {
                Console.WriteLine($"✗ FAILED! Status: {statusCode}");
                Console.WriteLine($"Error: {response}");
            }
        }

        static void TestCheckStatus(InstagramPublisher publisher, string instagramAccountId, string accessToken)
        {
            Console.WriteLine("\n--- Check Container Status ---");
            
            Console.Write("Enter creation/container ID: ");
            string creationId = Console.ReadLine();

            try
            {
                string status = publisher.GetContainerStatus(instagramAccountId, accessToken, creationId);
                Console.WriteLine($"\nStatus: {status}");
                
                if (status == "FINISHED")
                {
                    Console.WriteLine("✓ Ready to publish!");
                }
                else if (status == "IN_PROGRESS")
                {
                    Console.WriteLine("⏳ Still processing...");
                }
                else if (status == "ERROR")
                {
                    Console.WriteLine("✗ Processing failed!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Error: {ex.Message}");
            }
        }
    }
}
