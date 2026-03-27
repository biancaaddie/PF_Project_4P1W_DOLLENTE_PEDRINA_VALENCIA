using System.ComponentModel.DataAnnotations;

namespace resource_api.Dtos
{
    public class SubmitGuessRequest
    {
        [Range(1, int.MaxValue)]
        public int PuzzleId { get; set; }

        [Required]
        [MaxLength(64)]
        public string Guess { get; set; } = string.Empty;
    }
}
