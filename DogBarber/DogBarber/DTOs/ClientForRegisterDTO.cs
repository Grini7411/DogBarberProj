using System;
using System.ComponentModel.DataAnnotations;

namespace DogBarber.DTOs
{
    public class ClientForRegisterDTO
    {
        [Required]
        public string FullName { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string DogName { get; set; }
    }
}
