using FluentValidation;
using Rectangle_SVG_Drawer.API.Models;

namespace Rectangle_SVG_Drawer.API.Validators
{
    public class RectangleValidator : AbstractValidator<Rectangle>
    {
        private const int MinimumHeightWidth = 40;
        private const string LessOrEqualToZeroErrorFormat = "{0} must be greater than or equal to 40";
        private const string InvalidWidthHeightErrorMessage = "Width must not exceed the Height";

        public RectangleValidator()
        {
            RuleFor(x => x.Height)
                .GreaterThanOrEqualTo(MinimumHeightWidth)
                .WithMessage(x => string.Format(LessOrEqualToZeroErrorFormat, nameof(x.Height)));

            RuleFor(x => x.Width)
                .GreaterThanOrEqualTo(MinimumHeightWidth)
                .WithMessage(x => string.Format(LessOrEqualToZeroErrorFormat, nameof(x.Width)))
                .LessThanOrEqualTo(x => x.Height)
                .WithMessage(InvalidWidthHeightErrorMessage);
        }
    }
}
