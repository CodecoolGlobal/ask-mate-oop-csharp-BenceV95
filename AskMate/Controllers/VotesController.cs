using AskMate.Models.Vote;
using AskMate.Repos;
using AskMate.Repos.Votes;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace AskMate.Controllers
{
    [Authorize]
    [ApiController]
    public class VotesController : ControllerBase
    {
        private readonly IVotesRepo _votesRepo;
        public VotesController(IVotesRepo votesRepo)
        {
            _votesRepo = votesRepo;
        }

        //get method cannot have  a body, so i have to make it POST
        [HttpPost("/votes")]
        public IActionResult GetAllVotesByAnswerIds([FromBody] GetVotesRequest votesRequest)
        {
            try
            {
                var votes = _votesRepo.GetVotesByAnswerIds(votesRequest.AnswerIds);
                return Ok(votes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpPost("/vote")]
        public IActionResult PostVote([FromBody] VoteCreateRequest voteCreateRequest)
        {
            try
            {
                var vote = _votesRepo.VoteOnAnswer(voteCreateRequest);
                return Ok(vote);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("/votes/delete/{voteId}")]
        public IActionResult DeleteVote(int voteId)
        {
            try
            {
                _votesRepo.DeleteVote(voteId);
                return Ok(new { message = "Vote successfully deleted!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("/vote/change/{voteId}")]
        public IActionResult ChangeVote(int voteId)
        {
            try
            {
                _votesRepo.ChangeVote(voteId);
                return Ok(new { message = "Vote succesfully changed!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("/GetUsersAnswersUsefulnessRatio")]
        public IActionResult GetUsersAnswersUsefulnessRatio()
        {
            try
            {
                var username = User.Identity.Name; // Get the logged-in user's name
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                return Ok(_votesRepo.CalculateUserAnswersUsefulnessRatio(userId));
            }
            catch (Exception e)
            {
                return BadRequest(new { Message = e.Message });
            }
        }
    }
}
