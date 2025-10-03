using Microsoft.AspNetCore.Mvc;
using DigitalMarketplaceAPI.Models;
using DigitalMarketplaceAPI.Services;
using MongoDB.Driver;

namespace DigitalMarketplaceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly FirebaseAuthService _firebaseAuth;
        private readonly MongoDbService _mongoDb;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            FirebaseAuthService firebaseAuth, 
            MongoDbService mongoDb,
            ILogger<AuthController> logger)
        {
            _firebaseAuth = firebaseAuth;
            _mongoDb = mongoDb;
            _logger = logger;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInRequest request)
        {
            try
            {
                // Get the Firebase ID token from the Authorization header
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (authHeader == null || !authHeader.StartsWith("Bearer "))
                {
                    return BadRequest("Missing or invalid Authorization header");
                }

                var idToken = authHeader.Substring("Bearer ".Length).Trim();

                // Verify the Firebase token
                var decodedToken = await _firebaseAuth.VerifyIdTokenAsync(idToken);
                
                _logger.LogInformation($"Firebase token verified for user: {decodedToken.Uid}");

                // Check if user exists in our database (if MongoDB is available)
                User user = null;
                
                if (_mongoDb.Users != null)
                {
                    var existingUser = await _mongoDb.Users
                        .Find(u => u.FirebaseUid == decodedToken.Uid)
                        .FirstOrDefaultAsync();

                    if (existingUser == null)
                    {
                        // Create new user
                        user = new User
                        {
                            FirebaseUid = decodedToken.Uid,
                            Email = request.Email,
                            DisplayName = request.DisplayName,
                            PhotoURL = request.PhotoURL,
                            CreatedAt = DateTime.UtcNow,
                            LastLoginAt = DateTime.UtcNow
                        };

                        await _mongoDb.Users.InsertOneAsync(user);
                        _logger.LogInformation($"New user created: {user.Email}");
                    }
                    else
                    {
                        // Update existing user
                        var update = Builders<User>.Update
                            .Set(u => u.LastLoginAt, DateTime.UtcNow)
                            .Set(u => u.DisplayName, request.DisplayName)
                            .Set(u => u.PhotoURL, request.PhotoURL);

                        await _mongoDb.Users.UpdateOneAsync(
                            u => u.FirebaseUid == decodedToken.Uid, 
                            update);

                        user = existingUser;
                        user.LastLoginAt = DateTime.UtcNow;
                        _logger.LogInformation($"User updated: {user.Email}");
                    }
                }
                else
                {
                    // MongoDB not available, create a temporary user object
                    user = new User
                    {
                        FirebaseUid = decodedToken.Uid,
                        Email = request.Email,
                        DisplayName = request.DisplayName,
                        PhotoURL = request.PhotoURL,
                        CreatedAt = DateTime.UtcNow,
                        LastLoginAt = DateTime.UtcNow
                    };
                    _logger.LogInformation($"User authenticated (MongoDB not available): {user.Email}");
                }

                return Ok(new
                {
                    success = true,
                    message = "User authenticated successfully",
                    user = new
                    {
                        id = user.Id,
                        firebaseUid = user.FirebaseUid,
                        email = user.Email,
                        displayName = user.DisplayName,
                        photoURL = user.PhotoURL,
                        role = user.Role,
                        createdAt = user.CreatedAt,
                        lastLoginAt = user.LastLoginAt
                    }
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning($"Authentication failed: {ex.Message}");
                return Unauthorized(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Authentication error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpGet("verify")]
        public async Task<IActionResult> VerifyToken()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (authHeader == null || !authHeader.StartsWith("Bearer "))
                {
                    return BadRequest("Missing or invalid Authorization header");
                }

                var idToken = authHeader.Substring("Bearer ".Length).Trim();
                var decodedToken = await _firebaseAuth.VerifyIdTokenAsync(idToken);

                User user = null;
                
                if (_mongoDb.Users != null)
                {
                    user = await _mongoDb.Users
                        .Find(u => u.FirebaseUid == decodedToken.Uid)
                        .FirstOrDefaultAsync();

                    if (user == null)
                    {
                        return NotFound(new { success = false, message = "User not found" });
                    }
                }
                else
                {
                    return Ok(new { success = true, message = "Token valid (MongoDB not available)" });
                }

                return Ok(new
                {
                    success = true,
                    user = new
                    {
                        id = user.Id,
                        firebaseUid = user.FirebaseUid,
                        email = user.Email,
                        displayName = user.DisplayName,
                        photoURL = user.PhotoURL,
                        role = user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Token verification error: {ex.Message}");
                return Unauthorized(new { success = false, message = "Invalid token" });
            }
        }
    }

    public class GoogleSignInRequest
    {
        public string Uid { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? PhotoURL { get; set; }
    }
}
