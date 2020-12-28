using System;
using System.Threading.Tasks;
using DogBarber.data;
using DogBarber.DTOs;
using DogBarber.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace DogBarber.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly ClientRepository _clientRepo;
        private readonly AppointmentRepository _appointemntRepo;
        public AppointmentController(ClientRepository clientRepo, AppointmentRepository appointemntRepo)
        {
            _clientRepo = clientRepo;
            _appointemntRepo = appointemntRepo;

        }

        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var appointments = await _appointemntRepo.GetAppointments();
            
            return Ok(appointments);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment([FromRoute] int id)
        {
            var appointment = await _appointemntRepo.GetAppointment(id);
            return Ok(appointment);
        }

        [HttpPost("new")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddNewAppointment([FromBody] NewAppointmentDTO bodyObj)
        {
            var appointmentToCreate = new Appointment
            {
                ClientId = bodyObj.ClientId,
                Date = Convert.ToDateTime(bodyObj.Date),
            };
            bool isCreated = await _appointemntRepo.AddNewAppointment(appointmentToCreate);
            if (isCreated)
                return Ok(new { success = true });
            else
            {
                return BadRequest();
            }
        }

        [HttpPut("update/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateAppointment([FromRoute] int id, AppointmentToUpdateDTO appointmentToUpdateDTO)
        {
            var appointmentToUpdate = new Appointment
            {
                Date = Convert.ToDateTime(appointmentToUpdateDTO.NewDate)
            };
            bool isUpdated = await _appointemntRepo.UpdateAppointment(id, appointmentToUpdate);

            if (!isUpdated)
            {
                return BadRequest();
            }

            return Ok(new { msg = $"The appointment id {id} has updated successfully!", success = true });
        }

        [HttpDelete("delete/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteAppointment([FromRoute] int id)
        {
            bool isDeleted = await _appointemntRepo.DeleteAppointment(id);
            if (!isDeleted)
            {
                return BadRequest();
            }
            return Ok(new { msg = $"Deleted with Id {id} successfully", success = true });
        }
    }
}
