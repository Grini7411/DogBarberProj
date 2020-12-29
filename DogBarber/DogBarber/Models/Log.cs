using System;
namespace DogBarber.Models
{
    public class Log
    {
        public long Id { get; set; }
        public int ClientId { get; set; }
        public long LoginCount { get; set; }
    }
}
