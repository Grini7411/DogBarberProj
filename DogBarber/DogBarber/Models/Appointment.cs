using System;
namespace DogBarber.Models
{
    public class Appointment : BaseEntity
    {
        public long Id { get; set; }
        // FK from Client
        public long ClientId { get; set; }
        public Client Client { get; set; }
        public DateTime Date { get; set; }
        
    }
}
