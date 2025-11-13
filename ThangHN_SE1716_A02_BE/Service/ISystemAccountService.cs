using BO.Models;

namespace Service
{
    public interface ISystemAccountService
    {
        void AddSystemAccount(SystemAccount account);
        bool CanDeleteSystemAccount(int id);
        void DeleteSystemAccount(int id);
        List<SystemAccount> GetAllSystemAccounts();
        SystemAccount GetSystemAccount(string email, string password);
        SystemAccount GetSystemAccountById(int id);
        List<SystemAccount> SearchSystemAccounts(string? name, string? email);
        void UpdateSystemAccount(SystemAccount account);
    }
}