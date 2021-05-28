using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using api.Models;
using Microsoft.Azure.Cosmos.Table;

namespace api.Helpers
{
    public interface IStorageHelper
    {
        public Task<List<TestEntity>> GetEntities();
    }

    public class StorageHelper: IStorageHelper
    {
        private static CloudTableClient _tableClient;
        private static readonly string _tableName = "test";

        public StorageHelper(string storageConnectionString)
        {
            var storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            _tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());
        }

        public async Task<List<TestEntity>> GetEntities()
        {
            var entities = await GetEntities<TestEntity>("", _tableName);
            //var persons = personEntities.Select(p => p.ToPerson()).ToList();

            return entities;
        }

        private static async Task<List<T>> GetEntities<T>(string partitionKey, string tableName) where T : TableEntity, new()
        {
            var query =
                new TableQuery<T>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal,
                    partitionKey));
            return await GetAllEntitiesFromTable(tableName, query);
        }


        private static async Task<List<T>> GetAllEntitiesFromTable<T>(string tableName, TableQuery<T> tableQuery) where T : TableEntity, new()
        {
            var table = _tableClient.GetTableReference(tableName);
            var entities = new List<T>();

            TableContinuationToken continuationToken = null;
            do
            {
                var page = await table.ExecuteQuerySegmentedAsync(tableQuery, continuationToken);
                continuationToken = page.ContinuationToken;
                var entitySegmented = page.Results;
                entities.AddRange(entitySegmented);
            }
            while (continuationToken != null);

            return entities;
        }
    }
}
