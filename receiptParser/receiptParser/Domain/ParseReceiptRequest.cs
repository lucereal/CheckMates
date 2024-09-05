namespace receiptParser.Domain
{
    public class ParseReceiptRequest
    {
        public IList<IFormFile> file { get; set; }

        public List<string> users { get; set; }
    }
}
