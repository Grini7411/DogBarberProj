using System;
using System.Threading.Tasks;
using DogBarber.Models;
using Microsoft.AspNetCore.Mvc;
using DogBarber.DTOs;
using DogBarber.data;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Data.SqlClient;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DogBarber.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthRepository _authRepo;
        private readonly IConfiguration _config;

        public AuthController(AuthRepository authRepository, IConfiguration config)
        {
            _authRepo = authRepository;
            _config = config;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] ClientForRegisterDTO ClientDTO)
        {
            if (ClientDTO.Username == string.Empty)
            {
                return BadRequest("you should enter a valid username");
            }
            if (await _authRepo.UserExists(ClientDTO.Username))
                return BadRequest("Username already exists");
            ClientDTO.Username = ClientDTO.Username.ToLower();
            Client clientToCreate = new Client
            {
                Username = ClientDTO.Username,
                DogName = ClientDTO.DogName,
                FullName = ClientDTO.FullName
            };
            Client createdClient = await _authRepo.Register(clientToCreate, ClientDTO.Password);
            SendClientDetailsDTO outClient = new SendClientDetailsDTO
            {
                Id = createdClient.Id,
                DogName = createdClient.DogName,
                FullName = createdClient.FullName,
                Appointments = createdClient.Appointments
            };
            return Ok(outClient);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] ClientForLoginDTO clientDTO)
        {
            Client clientFromRepo = await _authRepo.Login(clientDTO.Username.ToLower(), clientDTO.Password);
            if (clientFromRepo == null) return Unauthorized();
            Claim[] claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, clientFromRepo.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, clientFromRepo.Username)
            };
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config.GetSection("AppSettings:Token").Value));

            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

            SendClientDetailsDTO outClient = new SendClientDetailsDTO
            {
                Id = clientFromRepo.Id,
                DogName = clientFromRepo.DogName,
                FullName = clientFromRepo.FullName,
                Appointments = clientFromRepo.Appointments
            };
            
            

            return Ok(new {success = true, token = tokenHandler.WriteToken(token), clientId = outClient });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {

            return Ok();
        }
    }
}
