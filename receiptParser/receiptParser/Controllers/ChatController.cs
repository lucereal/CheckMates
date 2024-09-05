using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using receiptParser.Hubs;
using receiptParser.Domain;

namespace receiptParser.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        [Route("/v")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message.User, message.Text);
            return Ok();
        }

        [HttpPost]
        [Route("/s")]
        public async Task<IActionResult> SendMessageUser([FromBody] Message message)
        {
            await _hubContext.Clients.All.SendAsync("SendChatMessage", message.User, message.Text);
            
            return Ok();
        }

        [HttpPost]
        [Route("/group")]
        public async Task<IActionResult> SendMessageToGroup([FromBody] Message message)
        {
            await _hubContext.Clients.Group(message.Group).SendAsync("GroupUpdate", message.Text);
           // await _hubContext.Clients.All.SendAsync("SendChatMessage", message.Group, message.Text);

            return Ok();
        }
    }
}
