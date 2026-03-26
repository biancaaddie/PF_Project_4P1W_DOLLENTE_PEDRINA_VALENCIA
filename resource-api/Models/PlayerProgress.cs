namespace resource_api.Models
{
    public class PlayerProgress
    {
        public int Id { get; set; }
        public int Solved { get; set; }
        public int Attempts { get; set; }
        public int Score { get; set; }
    }
}