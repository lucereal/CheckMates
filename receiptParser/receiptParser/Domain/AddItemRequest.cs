namespace receiptParser.Domain
{
    public class AddItemRequest
    {
        public AddItemRequest()
        {

        }

        public string id { get; set; }

        public string description { get; set; }
        public double price { get; set; }

        public double quantity { get; set; }

    }
}
