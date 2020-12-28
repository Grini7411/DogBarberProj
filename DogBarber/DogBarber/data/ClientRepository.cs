using System;
using System.Linq;
using System.Collections.Generic;
using DogBarber.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace DogBarber.data
{
    public class ClientRepository
    {
        private readonly DataContext _datacontext;
        public ClientRepository(DataContext dataContext)
        {
            _datacontext = dataContext;
        }
        public async Task<IEnumerable<Client>> GetAllClients()
        {
            var clients = await _datacontext.Clients.ToListAsync();
            return clients;
        }

        public async Task<Client> GetClient(long id)
        {
            var client = await _datacontext.Clients.FirstOrDefaultAsync(u => u.Id == id);
            return client;
        }

        public async Task<bool> DeleteClient(int id)
        {
            bool isDeleted = false;
            var targetClient = await _datacontext.Clients.FirstOrDefaultAsync(u => u.Id == id);
            if (targetClient != null)
            {
                _datacontext.Clients.Remove(targetClient);
                await _datacontext.SaveChangesAsync();
                isDeleted = true;
            }
            return isDeleted;
        }

    }
}
