using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.DTO
{
    public class ApiResponse
    {
        public string Message { get; set; } = null!;
        public string StatusCode { get; set; } = null!;
        public object? Data { get; set; }

        public ApiResponse(string message, string statusCode, object? data = null)
        {
            Message = message;
            StatusCode = statusCode;
            Data = data;
        }
    }
}
