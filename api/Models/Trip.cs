using System;
using System.Collections.Generic;

namespace api.Models
{
    public class Trip
    {
        public string Id { get; set; }
        public DateTimeOffset Date { get; set; } = new DateTimeOffset(DateTime.Now);
        public string Name { get; set; }
        public string Description { get; set; }
        public string Parking { get; set; }
        public List<string> Notes { get; set; }
        public List<string> Participants { get; set; }
        public List<string> Images { get; set; }
    }
}
