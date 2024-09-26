namespace receiptParser.Domain
{
    public class EditItemRequest
    {
        public string id { get; set; }
        public int itemId { get; set; }

        public double quantity { get; set; }

        public string description { get; set; }

        public double price { get; set; }
    }
}
