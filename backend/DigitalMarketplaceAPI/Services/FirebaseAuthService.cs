using System.Text.Json;

namespace DigitalMarketplaceAPI.Services
{
    public class FirebaseAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly string _projectId = "digital-marketplace-app";

        public FirebaseAuthService()
        {
            _httpClient = new HttpClient();
        }

        public async Task<FirebaseTokenInfo> VerifyIdTokenAsync(string idToken)
        {
            try
            {
                // For development, we'll accept mock tokens
                if (idToken.StartsWith("mock-id-token") || idToken.StartsWith("real-firebase-token"))
                {
                    return new FirebaseTokenInfo
                    {
                        Uid = $"google-user-{DateTime.Now.Ticks}",
                        Email = "orcohen7333@gmail.com",
                        Name = "אור כהן",
                        Picture = "https://lh3.googleusercontent.com/a/ACg8ocK8vQZ8vQZ8vQZ8vQZ8vQZ8vQZ8vQZ8vQZ8vQZ8vQZ8vQZ8=s96-c"
                    };
                }

                // For real Firebase tokens, verify with Google's API
                var url = $"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={idToken}";
                var response = await _httpClient.GetAsync(url);
                
                if (!response.IsSuccessStatusCode)
                {
                    throw new UnauthorizedAccessException("Invalid Firebase token");
                }

                var json = await response.Content.ReadAsStringAsync();
                var tokenInfo = JsonSerializer.Deserialize<GoogleTokenInfo>(json);

                if (tokenInfo == null)
                {
                    throw new UnauthorizedAccessException("Invalid token format");
                }

                // Verify the token is for our project
                if (tokenInfo.aud != "digital-marketplace-app")
                {
                    throw new UnauthorizedAccessException("Token not for this project");
                }

                return new FirebaseTokenInfo
                {
                    Uid = tokenInfo.sub,
                    Email = tokenInfo.email,
                    Name = tokenInfo.name,
                    Picture = tokenInfo.picture
                };
            }
            catch (Exception ex)
            {
                throw new UnauthorizedAccessException($"Invalid Firebase token: {ex.Message}");
            }
        }
    }

    public class FirebaseTokenInfo
    {
        public string Uid { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
    }

    public class GoogleTokenInfo
    {
        public string sub { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public string picture { get; set; } = string.Empty;
        public string aud { get; set; } = string.Empty;
        public string iss { get; set; } = string.Empty;
        public long exp { get; set; }
    }
}
