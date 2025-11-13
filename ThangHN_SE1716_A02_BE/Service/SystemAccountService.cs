using BO.Models;
using Microsoft.Extensions.Configuration;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class SystemAccountService : ISystemAccountService
    {
        private readonly ISystemAccountRepository _repository;
        private readonly IConfiguration _configuration;
        public SystemAccountService(ISystemAccountRepository repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }
        public SystemAccount GetSystemAccount(string email, string password)
        {
            if (email == _configuration["AdminAccount:Email"] && password == _configuration["AdminAccount:Password"])
            {
                return new SystemAccount
                    {
                        AccountId = 0,
                        AccountEmail = _configuration["AdminAccount:Email"],
                        AccountRole = _configuration.GetValue<int>("AdminAccount:Role"),
                };
            }
                
            else
            {
                return _repository.GetSystemAccount(email, password);
            }
        }
        public List<SystemAccount> GetAllSystemAccounts() => _repository.GetAllSystemAccounts();

        public SystemAccount GetSystemAccountById(int id) => _repository.GetSystemAccountById(id);

        public void AddSystemAccount(SystemAccount account) => _repository.AddSystemAccount(account);
        public void UpdateSystemAccount(SystemAccount account) => _repository.UpdateSystemAccount(account);
        public void DeleteSystemAccount(int id) => _repository.DeleteSystemAccount(id);
        public bool CanDeleteSystemAccount(int id) => _repository.CanDeleteSystemAccount(id);
        public List<SystemAccount> SearchSystemAccounts(string? name, string? email) => _repository.SearchSystemAccounts(name, email);
    }
}
