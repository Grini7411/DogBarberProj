using System;
namespace DogBarber.DTOs
{
    public class AppointmentToUpdateDTO
    {
        public long AppointmentId { get; set; }
        public string NewDate { get; set; }
        public string ClientId { get; set; }
    }
}
