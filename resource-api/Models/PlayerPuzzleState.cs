namespace resource_api.Models
{
    public class PlayerPuzzleState
    {
        public int Id { get; set; }
        public int PuzzleId { get; set; }
        public bool Solved { get; set; }
    }
}