using FluentValidation;
using Newtonsoft.Json;
using Rectangle_SVG_Drawer.API.Models;

namespace Rectangle_SVG_Drawer.API.Services
{
    public interface IRectangleService
    {
        public Task<Rectangle> GetRectangleAsync();

        public Task SaveRectangleAsync(Rectangle rectangle);
    }

    public class RectangleService : IRectangleService
    {
        private readonly IValidator<Rectangle> _validator;
        private readonly IFileService _fileService;
#pragma warning disable CS8601 // Possible null reference assignment.
        private readonly string _filePath = Path.GetDirectoryName(Environment.ProcessPath);
#pragma warning restore CS8601 // Possible null reference assignment.
        private const string _fileName = "rectange-svg-dimentions.json";
        private readonly string _fullFilePath = string.Empty;

        public RectangleService(IValidator<Rectangle> validator, IFileService fileService)
        {
            _validator = validator;
            _fileService = fileService;
            _fullFilePath = Path.Combine(_filePath ?? string.Empty, _fileName);
        }

        public async Task<Rectangle> GetRectangleAsync()
        {
            var fileContent = await _fileService.GetFileContentAsync(_fullFilePath);

            if (fileContent == null) throw new FileNotFoundException("File not found!");

            try
            {
                // Parse the file content
                var result = JsonConvert.DeserializeObject<Rectangle>(fileContent);
                if (result == null) throw new InvalidDataException("Invalid file content.");
                return result;
            }
            catch (Exception)
            {
                throw new InvalidDataException("Invalid JSON format.");
            }
        }

        public async Task SaveRectangleAsync(Rectangle rectangle)
        {
            // Imitate long-lasting calculations
            Thread.Sleep(10000);

            var validationResult = _validator.Validate(rectangle);
            if (!validationResult.IsValid)
            {
                // Throw exceptions if validation failed
                throw new BadHttpRequestException(validationResult.Errors.First().ErrorMessage);
            }

            // Save new/updated JSON in file
            var fileContent = JsonConvert.SerializeObject(rectangle, Formatting.Indented);
            await _fileService.SaveFileContentAsync(_fullFilePath, fileContent);
        }
    }
}
