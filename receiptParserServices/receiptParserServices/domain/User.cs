using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace receiptParserServices.domain
{
    internal class User
    {
        public User()
        {

        }
        public int userId { get; set; }
        public string name { get; set; }

    }
}
