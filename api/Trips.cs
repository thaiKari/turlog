using System;
using System.IO;
using System.Threading.Tasks;
using api.Helpers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Trips
{
    public static class Trips
    {
        [FunctionName("trips")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get",  Route = null)] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            var storageHelper = GetStorageHelper(context);
            var entities = await storageHelper.GetTrips();
            return new OkObjectResult(entities);
        }

        [FunctionName("trip")]
        public static async Task<IActionResult> CreateTrip(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            var trip = await DeserializeTrip(req.Body);
            var storageHelper = GetStorageHelper(context);
            var insertedTrip = await storageHelper.CreateTrip(trip);
            return new OkObjectResult(insertedTrip);
        }

        [FunctionName("settings")]
        public static async Task<IActionResult> GetImageUrl(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "settings")] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            var config = SetupConfig(context);
            var settings = new Settings()
            {
                Imagesurl = config["ImagesUrl"]
            };

            return new OkObjectResult(settings);
        }

        private static async Task<Trip> DeserializeTrip(Stream reqBody)
        {
            string requestBody;
            using (var streamReader = new StreamReader(reqBody))
            {
                requestBody = await streamReader.ReadToEndAsync();
            }
            var trip = JsonConvert.DeserializeObject<Trip>(requestBody);
            return trip;
        }

        private static IStorageHelper GetStorageHelper(ExecutionContext context)
        {
            var config = SetupConfig(context);
            var connectionString = config["StorageAccountConnectionString"];
            return new StorageHelper(connectionString);
        }

        private static IConfiguration SetupConfig(ExecutionContext context)
        {
            return new ConfigurationBuilder()
                .SetBasePath(context.FunctionAppDirectory)
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
        }
    }
}
