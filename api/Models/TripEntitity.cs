using System;
using System.Collections.Generic;
using Microsoft.Azure.Cosmos.Table;
using Newtonsoft.Json;

namespace api.Models
{
    public class TripEntity : TableEntity
    {
        public TripEntity()
        {

        }

        public TripEntity(Trip trip)
        {
            PartitionKey = "";
            RowKey = trip.Id ?? Guid.NewGuid().ToString();
            Date = trip.Date;
            Name = trip.Name;
            Description = trip.Description;
            Parking = trip.Parking;
            Notes = JsonConvert.SerializeObject(trip.Notes);
            Participants = JsonConvert.SerializeObject(trip.Participants);
            Images = JsonConvert.SerializeObject(trip.Images);
            Location = JsonConvert.SerializeObject(trip.Location);
        }

        public DateTime Date { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Parking { get; set; }
        public string Notes { get; set; }
        public string Participants { get; set; }
        public string Images { get; set; }
        public string Location { get; set; }

        public Trip ToTrip()
        {
            return new Trip()
            {
                Id = RowKey,
                Date = Date,
                Name = Name,
                Description = Description,
                Parking = Parking,
                Notes = Notes == null ? null : JsonConvert.DeserializeObject<List<string>>(Notes),
                Participants = Participants == null ? null : JsonConvert.DeserializeObject<List<string>>(Participants),
                Images = Images == null ? null : JsonConvert.DeserializeObject<List<string>>(Images),
                Location = Location == null ? null : JsonConvert.DeserializeObject<Location>(Location)
            };
        }
    }
}
