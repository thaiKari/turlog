
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.Cosmos.Table.Queryable;
using Microsoft.Azure.Documents.SystemFunctions;

namespace api.Helpers
{
    public interface IStorageHelper
    {
        public Task<Trip> CreateTrip(Trip trip);
        public Task<List<Trip>> GetTrips();
    }

    public class StorageHelper: IStorageHelper
    {
        private static CloudTableClient _tableClient;
        private const string _tableName = "trip";

        public StorageHelper(string storageConnectionString)
        {
            var storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            _tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());
        }

        public async Task<Trip> CreateTrip(Trip trip)
        {
            var insertedTrip = (await MergeEntity(new TripEntity(trip), _tableName)).ToTrip();
            return insertedTrip;
        }

        public async Task<List<Trip>> GetTrips()
        {
            var tripEntities = await GetEntities<TripEntity>("", _tableName);
            var trips = tripEntities.Select(p => p.ToTrip()).ToList();

            return trips;
        }

        private static async Task<T> MergeEntity<T>(T entity, string tableName) where T : TableEntity, new()
        {
            var table = _tableClient.GetTableReference(tableName);
            var insertOrMergeOperation = TableOperation.InsertOrMerge(entity);

            var result = await table.ExecuteAsync(insertOrMergeOperation);
            var insertedEntity = result.Result as T;

            return insertedEntity;
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
