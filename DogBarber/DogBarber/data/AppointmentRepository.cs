using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DogBarber.Models;
using Microsoft.EntityFrameworkCore;

namespace DogBarber.data
{
    public class AppointmentRepository
    {
        private readonly DataContext _datacontext;
        public AppointmentRepository(DataContext dataContext)
        {
            _datacontext = dataContext;
        }

        public async Task<IEnumerable<Appointment>> GetAppointments()
        {
            IEnumerable<Appointment> appointments = await _datacontext.Appointments.ToListAsync();
            foreach (Appointment appointment in appointments)
            {
                appointment.Client = await _datacontext.Clients.FirstOrDefaultAsync(x => x.Id == appointment.ClientId);
            };

            return appointments;
        }

        public async Task<Appointment> GetAppointment(int id)
        {
            Appointment targetAppointment = await _datacontext.Appointments
                .FirstOrDefaultAsync(u => u.Id == id);

            return targetAppointment;
        }
        public async Task<bool> DeleteAppointment(int id)
        {
            bool isDeleted = false;
            Appointment targetAppointment = await FindByIdAsync(id);
            if (targetAppointment != null)
            {
                _datacontext.Appointments.Remove(targetAppointment);
                await _datacontext.SaveChangesAsync();
                isDeleted = true;
            }
            return isDeleted;
        }

        public async Task<bool> UpdateAppointment(int id, Appointment updAppointment)
        {
            bool isUpdated = false;
            Appointment existingAppointment = await FindByIdAsync(id);

            existingAppointment.Date = updAppointment.Date;
            
            if (existingAppointment != null)
            {
                _datacontext.Appointments.Update(existingAppointment);
                await _datacontext.SaveChangesAsync();
                isUpdated = true;
            }
            
            return isUpdated;
        }

        public async Task<bool> AddNewAppointment(Appointment appointment)
        {
            bool isCreated = false;
            if (appointment != null)
            {
                await _datacontext.Appointments.AddAsync(appointment);
                await _datacontext.SaveChangesAsync();
                isCreated = true;
            }
            return isCreated;
        }

        private async Task<Appointment> FindByIdAsync(int id)
        {
            return await _datacontext.Appointments.FirstOrDefaultAsync(u => u.Id == id);
        }
    }
}
