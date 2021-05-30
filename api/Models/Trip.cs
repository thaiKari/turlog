using System;
using System.Collections.Generic;

namespace api.Models
{
    public class Trip
    {
        public string Id { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public string Name { get; set; }
        public string Description { get; set; }
        public string Parking { get; set; }
        public List<string> Notes { get; set; }
        public List<string> Participants { get; set; }
        public List<string> Images { get; set; }
    }
}
