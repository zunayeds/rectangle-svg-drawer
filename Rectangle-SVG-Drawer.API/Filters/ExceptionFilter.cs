using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace Rectangle_SVG_Drawer.API.Filters
{
    public class ExceptionFilter : IExceptionFilter
    {
        // For handling exceptions and returning error response
        public void OnException(ExceptionContext context)
        {
            context.Result = new ContentResult
            {
                Content = context.Exception.Message,
                StatusCode = (int)HttpStatusCode.BadRequest,
            };
        }
    }
}
