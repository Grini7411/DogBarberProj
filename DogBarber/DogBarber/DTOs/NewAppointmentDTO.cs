using System;
using DogBarber.Models;

namespace DogBarber.DTOs
{
    public class NewAppointmentDTO
    {
        public long ClientId { get; set; }
        public string Date { get; set; }
    }
}
