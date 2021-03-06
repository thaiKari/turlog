
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.Cosmos.Table.Queryable;
using Microsoft.Azure.Documents.SystemFunctions;
using Microsoft.WindowsAzure.Storage.Blob;

namespace api.Helpers
{
    public interface IStorageHelper
    {
        Task<Trip> CreateTrip(Trip trip);
        Task<List<Trip>> GetTrips();
        Task UploadFile(IFormFile file);
        Task DeleteTrip(string id);
        Task<Trip> GetTrip(string id);
    }

    public class StorageHelper: IStorageHelper
    {
        private static CloudTableClient _tableClient;
        private static BlobServiceClient _blobServiceClient;
        private const string _tableName = "trip";
        private const string _imageContainerName = "images";

        public StorageHelper(string storageConnectionString)
        {
            var storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            _tableClient = storageAccount.CreateCloudTableClient(new TableClientConfiguration());
            _blobServiceClient = new BlobServiceClient(storageConnectionString);
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

        public async Task UploadFile(IFormFile file)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(_imageContainerName);
            var blobClient = containerClient.GetBlobClient(file.FileName);

            try
            {
                using (var stream = file.OpenReadStream())
                {
                    var response = await blobClient.UploadAsync(stream, true);
                    Console.WriteLine(response);

                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Catch"+e);
                var blobLeaseClient = blobClient.GetBlobLeaseClient();
                try
                {
                    BlobLease blobLease = await blobLeaseClient.AcquireAsync(TimeSpan.FromSeconds(15));
                    Console.WriteLine("Blob lease acquired. LeaseId = {0}", blobLease.LeaseId);

                    // Set the request condition to include the lease ID.
                    var blobUploadOptions = new BlobUploadOptions()
                    {
                        Conditions = new BlobRequestConditions()
                        {
                            LeaseId = blobLease.LeaseId
                        }
                    };
                    using (var stream = file.OpenReadStream())
                    {
                        var response = await blobClient.UploadAsync(stream, blobUploadOptions);
                    };

                }
                finally
                {
                    await blobLeaseClient.ReleaseAsync();
                }
            }
            
        }

        public async Task DeleteTrip(string id)
        {
            var trip = await GetEntity<TripEntity>("", id, _tableName);
            await DeleteEntity(trip, _tableName);
        }

        public async Task<Trip> GetTrip(string id)
        {
            var tripEntity = await GetEntity<TripEntity>("", id, _tableName);
            return tripEntity.ToTrip();
        }

        private async Task<T> GetEntity<T>(string partitionKey, string id, string tableName) where T : TableEntity, new()
        {
            var table = _tableClient.GetTableReference(tableName);
            var retrieveOperation = TableOperation.Retrieve<T>(partitionKey, id);
            var result = await table.ExecuteAsync(retrieveOperation);
            var entity = result.Result as T;

            return entity;
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
        private static async Task DeleteEntity<T>(T entity, string tableName) where T : TableEntity, new()
        {
            var table = _tableClient.GetTableReference(tableName);
            var insertOrMergeOperation = TableOperation.Delete(entity);
            await table.ExecuteAsync(insertOrMergeOperation);
        }
    }
}
