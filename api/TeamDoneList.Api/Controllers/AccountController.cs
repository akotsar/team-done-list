using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Owin;
using TeamDoneList.Api.Models;
using TeamDoneList.Api.Models.Repositories;

namespace TeamDoneList.Api.Controllers
{
    [Authorize]
    public class AccountController : ApiController
    {
        [ActionName("")]
        public async Task<IHttpActionResult> Get()
        {
            var user = Request.GetOwinContext().Authentication.User;
            return Ok(new
            {
                Greeting = string.Format("Hello, {0}!", user.FindFirst(ClaimTypes.Name).Value)
            });
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IHttpActionResult> Signup(SignupUserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (AccountRepository accountRepository = new AccountRepository())
            {
                await accountRepository.RegisterUser(userModel);
            }

            return Ok();
        }
    }
}
