﻿using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receiptParser.Repository.model
{
    public class User
    {
        public string userId { get; set; }
        public string name { get; set; }

        //public string connectionId { get; set; }
    }
}