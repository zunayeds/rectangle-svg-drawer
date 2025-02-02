using System.ComponentModel.DataAnnotations;

namespace Rectangle_SVG_Drawer.API.Models
{
    public class Rectangle
    {
        [Required]
        public required int Width { get; set; }

        [Required]
        public required int Height { get; set; }
    }
}