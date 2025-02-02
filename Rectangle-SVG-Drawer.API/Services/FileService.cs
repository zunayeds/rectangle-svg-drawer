namespace Rectangle_SVG_Drawer.API.Services
{
    public interface IFileService
    {
        public Task<string> GetFileContentAsync(string filePath);
        public Task SaveFileContentAsync(string filePath, string content);
    }

    public class FileService : IFileService
    {
        public async Task<string> GetFileContentAsync(string filePath)
        {
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException("Couldn't get requested file");
            }
            return await File.ReadAllTextAsync(filePath);
        }

        public async Task SaveFileContentAsync(string filePath, string content)
        {
            await File.WriteAllTextAsync(filePath, content);
        }
    }
}
