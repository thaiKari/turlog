using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Configuration;

namespace api.Helpers
{
    public static class ConfigHelper
    {
        public static IStorageHelper GetStorageHelper(ExecutionContext context)
        {
            var config = SetupConfig(context);
            var connectionString = config["StorageAccountConnectionString"];
            return new StorageHelper(connectionString);
        }

        public static IConfiguration SetupConfig(ExecutionContext context)
        {
            return new ConfigurationBuilder()
                .SetBasePath(context.FunctionAppDirectory)
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
        }
    }
}
