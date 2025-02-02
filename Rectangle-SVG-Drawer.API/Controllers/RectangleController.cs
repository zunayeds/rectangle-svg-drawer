using Microsoft.AspNetCore.Mvc;
using Rectangle_SVG_Drawer.API.Models;
using Rectangle_SVG_Drawer.API.Services;

namespace Rectangle_SVG_Drawer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RectangleController : ControllerBase
    {
        private readonly IRectangleService _rectangleService;

        public RectangleController(IRectangleService rectangleService)
        {
            _rectangleService = rectangleService;
        }

        [HttpGet]
        public async Task<ActionResult> GetRectangleAsync()
        {
            var result = await _rectangleService.GetRectangleAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task SaveRectangleAsync([FromBody] Rectangle request)
        {
            await _rectangleService.SaveRectangleAsync(request);
        }
    }
}
