using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Azure.Cosmos.Table;

namespace api.Models
{
    public class TestEntity: TableEntity
    {
        public string Value { get; set; }
    }

}
