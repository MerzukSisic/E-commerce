using System.Net;
using System.Security.Claims;
using API.DTOs;
using API.Extensions;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(SignInManager<AppUser> signInManager, IEmailService emailService) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        var user = new AppUser
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Email = registerDto.Email,
            UserName = registerDto.Email
        };
        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        return Ok();
    }


    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }


    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();

        var user = await signInManager.UserManager.GetUserByEmailWithAddress(User);

        if (user == null) return Unauthorized();
        return Ok(new
        {
            user.FirstName,
            user.LastName,
            user.Email,
            Address = user.Address?.toDto(),
            Roles = User.FindFirstValue(ClaimTypes.Role),
            user.EmailConfirmed
        });
    }

    [HttpGet("auth-status")]
    public ActionResult GetAuthState()
    {
        return Ok(new
        {
            IsAuthenticated = User.Identity?.IsAuthenticated ?? false
        });
    }


    [Authorize]
    [HttpPost("address")]
    public async Task<ActionResult<Address>> CreateOrUpdateAddress(AddressDto addressDto)
    {
        var user = await signInManager.UserManager.GetUserByEmailWithAddress(User);

        if (user.Address == null)
        {
            user.Address = addressDto.toEntity();
        }
        else
        {
            user.Address.UpdateFromDto(addressDto);
        }

        var result = await signInManager.UserManager.UpdateAsync(user);


        if (!result.Succeeded) return BadRequest("Problem updating Address");

        return Ok(user.Address.toDto());
    }

    [Authorize]
    [HttpPost("resend-confirmation")]
    public async Task<ActionResult> ResendConfirmationEmail()
    {
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(userEmail))
            return Unauthorized("User is not authenticated");

        var user = await signInManager.UserManager.FindByEmailAsync(userEmail);
        if (user == null)
            return BadRequest("User is not found");
        if (user.EmailConfirmed)
            return BadRequest("Email is already confirmed");

        var token = await signInManager.UserManager.GenerateEmailConfirmationTokenAsync(user);
        var frontendUrl = "https://localhost:4200";

        var encodedToken = WebUtility.UrlEncode(token);
        var confirmationLink =
            $"{frontendUrl}/confirm-email?email={WebUtility.UrlEncode(user.Email)}&token={encodedToken}";

        await emailService.SendEmailAsync(user.Email, "Verify Your Email", confirmationLink);

        return Ok(new { message = "Verification email sent." });
    }

    [HttpPost("confirm-email")]
    public async Task<ActionResult> ConfirmEmail([FromBody] EmailDto dto)
    {
        var user = await signInManager.UserManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return BadRequest("User not found.");

        var result = await signInManager.UserManager.ConfirmEmailAsync(user, dto.Token);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        return Ok(new { message = "Email confirmed successfully." });
    }
}