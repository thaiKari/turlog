using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace api.Models
{
    public class TripEntity: TableEntity
    {
        public TripEntity(Trip trip)
        {
            PartitionKey = "";
            RowKey = trip.Id ?? Guid.NewGuid().ToString();
            Date = trip.Date;
            Name = trip.Name;
            Description = trip.Description;
            Notes = JsonConvert.SerializeObject(trip.Notes);
            Images = JsonConvert.SerializeObject(trip.Images);
        }

        public DateTimeOffset Date { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public string Images { get; set; }

        public Trip ToTrip()
        {
            return new Trip()
            {
                Id = RowKey,
                Date = Date,
                Name = Name,
                Description = Description,
                Notes = JsonConvert.DeserializeObject<List<string>>(Notes),
                Images = JsonConvert.DeserializeObject<List<string>>(Images),
            };
        }
    }

    public class Trip
    {
        public string Id { get; set; }
        public DateTimeOffset Date { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<string> Notes { get; set; }
        public List<string> Images { get; set; }
    }
}
