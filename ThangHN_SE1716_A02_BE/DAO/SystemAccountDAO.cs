using BO.DAO;
using BO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAO
{
    public class SystemAccountDAO
    {
        private FUNewsManagementSystemDBContext _context;
        private static SystemAccountDAO _instance;

        public SystemAccountDAO(FUNewsManagementSystemDBContext context)
        {
            _context = context;
        }
        public static SystemAccountDAO Instance
        {
            get
            {
                if (_instance == null)
                {
                    var context = new FUNewsManagementSystemDBContext();
                    _instance = new SystemAccountDAO(context);
                }
                return _instance;
            }
        }
        public SystemAccount GetSystemAccount(string email, string password) => _context.SystemAccounts.FirstOrDefault(x => x.AccountEmail == email && x.AccountPassword == password);
        public List<SystemAccount> GetAllSystemAccounts() => _context.SystemAccounts.ToList();
        public SystemAccount GetSystemAccountById(int id) => _context.SystemAccounts.Find(id);
        public void AddSystemAccount(SystemAccount account)
        {
            _context.SystemAccounts.Add(account);
            _context.SaveChanges();
        }
        public void UpdateSystemAccount(SystemAccount account)
        {
            var existingAccount = _context.SystemAccounts.Find(account.AccountId);
            if (existingAccount != null)
            {
                existingAccount.AccountName = account.AccountName;
                existingAccount.AccountEmail = account.AccountEmail;
                existingAccount.AccountRole = account.AccountRole;
                if (!string.IsNullOrEmpty(account.AccountPassword))
                {
                    existingAccount.AccountPassword = account.AccountPassword;
                }
                _context.SystemAccounts.Update(existingAccount);
                _context.SaveChanges();
            }
        }
        public void DeleteSystemAccount(int id)
        {
            var account = _context.SystemAccounts.Find(id);
            if(account != null)
            {
                _context.SystemAccounts.Remove(account);
                _context.SaveChanges();
            }
        }
        public bool CanDeleteSystemAccount(int id) => !_context.NewsArticles.Any(na => na.CreatedById == id);
        public List<SystemAccount> SearchSystemAccounts(string? name, string? email)
        {
            var query = _context.SystemAccounts.AsQueryable();
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(sa => sa.AccountName == name);
            }
            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(sa => sa.AccountEmail == email);
            }
            return query.ToList();
        }
    }
}
