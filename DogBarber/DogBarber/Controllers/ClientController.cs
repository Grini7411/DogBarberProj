using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DogBarber.data;
using DogBarber.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DogBarber.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ClientController : ControllerBase
    {
        private ClientRepository _clientRepo;
        public ClientController(ClientRepository clientRepo)
        {
            _clientRepo = clientRepo;
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAllClients()
        {
            //Todo: Validations!!
            var allClients = await _clientRepo.GetAllClients();
            return Ok(allClients);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetSingleClient([FromRoute] int id)
        {
            var client = await _clientRepo.GetClient(id);
            return Ok(client);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteClient([FromRoute] int id)
        {
            var client = await _clientRepo.DeleteClient(id);
            return Ok(client);
        }

    }
}
