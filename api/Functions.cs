using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using api.Helpers;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace api
{
    public static class Functions
    {
        [FunctionName("trips")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get",  Route = null)] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            var storageHelper = ConfigHelper.GetStorageHelper(context);
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
            var storageHelper = ConfigHelper.GetStorageHelper(context);
            var insertedTrip = await storageHelper.CreateTrip(trip);
            return new OkObjectResult(insertedTrip);
        }

        [FunctionName("DeleteTrip")]
        public static async Task<IActionResult> DeletePerson(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "trip/{id}")] HttpRequest req,
            ExecutionContext context,
            ILogger log, string id)
        {
            var storageHelper = ConfigHelper.GetStorageHelper(context);
            await storageHelper.DeleteTrip(id);
            return new ObjectResult($"person with id {id} was deleted");

        }

        [FunctionName("settings")]
        public static IActionResult GetImageUrl(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "settings")] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            var config = ConfigHelper.SetupConfig(context);
            var settings = new Settings()
            {
                Imagesurl = config["ImagesUrl"]
            };

            return new OkObjectResult(settings);
        }

        [FunctionName("images")]
        public static async Task<IActionResult> UploadImage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "images/upload")] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            var imageFiles = (await req.ReadFormAsync()).Files;
            var storageHelper = ConfigHelper.GetStorageHelper(context);
            var uploadTasks = new List<Task>();
            
            for (var i = 0; i < imageFiles.Count; i++)
            {
                var file = imageFiles[i];
                uploadTasks.Add(storageHelper.UploadFile(file));
            }

            await Task.WhenAll(uploadTasks);

            return new OkObjectResult("files uploaded");
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


    }
}
