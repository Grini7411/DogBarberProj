using System;
using System.Threading.Tasks;
using DogBarber.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DogBarber.data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Client> Login(string username, string password)
        {
            //compare username with usernames in db
            Client client = await _context.Clients.FirstOrDefaultAsync(x => x.Username == username);
            if (client == null)
            {
                return null;
            }
            //compute hash for password and comare in db
            if (!VerifyPasswordHash(password, client.PasswordHash, client.PasswordSalt))
            {
                return null;
            }
            // This SP Logs the count of the entered user:
            _context.Database.ExecuteSqlRaw("EXEC dbo.Log_SIGN_IN @id={0}", client.Id);
            return client;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                byte[] computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i]) return false;
                }
                return true;
            }
        }

        public async Task<Client> Register(Client client, string password)
        {
            byte[] passwordHash;
            byte[] passwordSalt;
            CreatePassowordHash(password, out passwordHash, out passwordSalt);
            client.PasswordHash = passwordHash;
            client.PasswordSalt = passwordSalt;

            await _context.Clients.AddAsync(client);
            await _context.SaveChangesAsync();
            return client;
        }

        private void CreatePassowordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Clients.AnyAsync(x => x.Username == username))
                return true;

            return false;
        }
    }
}
