using receiptParser.Util.attributes;

namespace receiptParser.Repository.models
{
    [BsonCollection("connections")]

    public class Connection : Document
    {
        public Connection() { }

        public string receiptId { get; set; }

        public string connectionId { get; set; }

        public Boolean connected { get; set; }
    }
}
