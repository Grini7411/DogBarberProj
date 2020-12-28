using System;
using System.Collections.Generic;
using DogBarber.Models;

namespace DogBarber.DTOs
{
    public class SendClientDetailsDTO
    {
        public long Id { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string DogName { get; set; }
        public List<Appointment> Appointments { get; set; }
    }
}
