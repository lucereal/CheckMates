using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Domain
{
    internal class UserDto
    {
        public UserDto()
        {

        }
        public string userId { get; set; }
        public string name { get; set; }

    }
}
