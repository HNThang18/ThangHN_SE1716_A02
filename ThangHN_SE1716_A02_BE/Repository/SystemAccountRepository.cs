using BO.Models;
using DAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class SystemAccountRepository : ISystemAccountRepository
    {
        public SystemAccount GetSystemAccount(string email, string password) => SystemAccountDAO.Instance.GetSystemAccount(email, password);
        public List<SystemAccount> GetAllSystemAccounts() => SystemAccountDAO.Instance.GetAllSystemAccounts();
        public SystemAccount GetSystemAccountById(int id) => SystemAccountDAO.Instance.GetSystemAccountById(id);
        public void AddSystemAccount(SystemAccount account) => SystemAccountDAO.Instance.AddSystemAccount(account);
        public void UpdateSystemAccount(SystemAccount account) => SystemAccountDAO.Instance.UpdateSystemAccount(account);
        public void DeleteSystemAccount(int id) => SystemAccountDAO.Instance.DeleteSystemAccount(id);
        public bool CanDeleteSystemAccount(int id) => SystemAccountDAO.Instance.CanDeleteSystemAccount(id);
        public List<SystemAccount> SearchSystemAccounts(string? name, string? email) => SystemAccountDAO.Instance.SearchSystemAccounts(name, email);
    }
}
