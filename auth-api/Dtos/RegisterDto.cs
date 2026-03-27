using System.ComponentModel.DataAnnotations;

namespace auth_api.Dtos
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        [MaxLength(128)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [RegularExpression("^(player|admin)$", ErrorMessage = "Role must be either 'player' or 'admin'.")]
        public string Role { get; set; } = "player";
    }
}
