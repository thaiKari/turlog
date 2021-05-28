using System;
using System.IO;
using System.Threading.Tasks;
using api.Helpers;
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
            log.LogInformation("C# HTTP trigger function processed a request.");

            var storageHelper = GetStorageHelper(context);

            var entities = await storageHelper.GetEntities();
            return new OkObjectResult(entities);
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
