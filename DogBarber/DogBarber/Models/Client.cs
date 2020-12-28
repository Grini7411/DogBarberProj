using System;
using System.Collections.Generic;

namespace DogBarber.Models
{
    public class Client: BaseEntity
    {
        public long Id { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string DogName { get; set; }
        public List<Appointment> Appointments { get; set; }
    }
}
