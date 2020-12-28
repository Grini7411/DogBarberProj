using System;
using System.Threading.Tasks;
using DogBarber.Models;

namespace DogBarber.data
{
    public interface IAuthRepository
    {
        Task<Client> Register(Client client, string password);
        Task<Client> Login(string username, string password);
        Task<bool> UserExists(string username);
    }
}
