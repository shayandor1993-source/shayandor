using MongoDB.Driver;
using DigitalMarketplaceAPI.Models;

namespace DigitalMarketplaceAPI.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;

        public MongoDbService(IConfiguration configuration)
        {
            // For development, we'll use local MongoDB
            var connectionString = configuration.GetConnectionString("MongoDB") ?? 
                                 "mongodb://localhost:27017";
            
            try
            {
                var client = new MongoClient(connectionString);
                _database = client.GetDatabase("digitalmarketplace");
                
                // Test the connection
                _database.RunCommand<MongoDB.Bson.BsonDocument>(new MongoDB.Bson.BsonDocument("ping", 1));
                Console.WriteLine("✅ Connected to MongoDB successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ MongoDB connection failed: {ex.Message}");
                Console.WriteLine("⚠️  Continuing without MongoDB - users will not be saved");
                // For development, we'll continue without MongoDB
                _database = null;
            }
        }

        public IMongoCollection<User> Users => _database?.GetCollection<User>("users");
        
        // Future collections
        // public IMongoCollection<Item> Items => _database.GetCollection<Item>("items");
        // public IMongoCollection<Offer> Offers => _database.GetCollection<Offer>("offers");
    }
}
