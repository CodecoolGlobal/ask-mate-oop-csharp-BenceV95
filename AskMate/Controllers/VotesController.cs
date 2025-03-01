using AskMate.Models.Vote;
using AskMate.Repos;
using AskMate.Repos.Votes;
using Microsoft.AspNetCore.Mvc;

namespace AskMate.Controllers
{
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
                return BadRequest(ex.Message);
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
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("/votes/delete/{voteId}")]
        public IActionResult DeleteVote(int voteId)
        {
            try
            {
                _votesRepo.DeleteVote(voteId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("/vote/change/{voteId}")]
        public IActionResult ChangeVote(int voteId)
        {
            try
            {
                _votesRepo.ChangeVote(voteId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
