namespace resource_api.Dtos
{
    public class SubmitGuessRequest
    {
        public int PuzzleId { get; set; }
        public string Guess { get; set; } = string.Empty;
    }
}