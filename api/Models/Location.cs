namespace api.Models
{
    public class Location
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Kommune { get; set; }
        public string Fylke { get; set; }
        public Coordinates Coordinates { get; set; }
    }
}