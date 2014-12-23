using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using WhoDidWhat.Api.Models;
using WhoDidWhat.Api.Models.Repositories;

namespace WhoDidWhat.Api.Auth
{
    /// <summary>
    /// A simple implementation of the <see cref="OAuthAuthorizationServerProvider" /> class.
    /// </summary>
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        /// <summary>
        /// The account repository factory.
        /// </summary>
        private readonly Func<AccountRepository> _accountRepositoryFactory;

        /// <summary>
        /// Initializes a new instance of the <see cref="SimpleAuthorizationServerProvider"/> class.
        /// </summary>
        /// <param name="accountRepositoryFactory">The account repository factory.</param>
        public SimpleAuthorizationServerProvider(Func<AccountRepository> accountRepositoryFactory)
        {
            _accountRepositoryFactory = accountRepositoryFactory;
        }

        /// <summary>
        /// Called to validate that the origin of the request is a registered "client_id", and that the correct credentials for that client are
        /// present on the request. If the web application accepts Basic authentication credentials,
        /// context.TryGetBasicCredentials(out clientId, out clientSecret) may be called to acquire those values if present in the request header. If the web
        /// application accepts "client_id" and "client_secret" as form encoded POST parameters,
        /// context.TryGetFormCredentials(out clientId, out clientSecret) may be called to acquire those values if present in the request body.
        /// If context.Validated is not called the request will not proceed further.
        /// </summary>
        /// <param name="context">The context of the event carries information in and results out.</param>
        /// <returns>
        /// Task to enable asynchronous execution
        /// </returns>
        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // We have only one client, therefore always return that its validated successfully.
            context.Validated();
            return Task.FromResult(0);
        }

        /// <summary>
        /// Called when a request to the Token endpoint arrives with a "grant_type" of "password". This occurs when the user has provided name and password
        /// credentials directly into the client application's user interface, and the client application is using those to acquire an "access_token" and
        /// optional "refresh_token". If the web application supports the
        /// resource owner credentials grant type it must validate the context.Username and context.Password as appropriate. To issue an
        /// access token the context.Validated must be called with a new ticket containing the claims about the resource owner which should be associated
        /// with the access token. The application should take appropriate measures to ensure that the endpoint isn’t abused by malicious callers.
        /// The default behavior is to reject this grant type.
        /// See also http://tools.ietf.org/html/rfc6749#section-4.3.2
        /// </summary>
        /// <param name="context">The context of the event carries information in and results out.</param>
        /// <returns>
        /// Task to enable asynchronous execution
        /// </returns>
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            // NOTE: for testing purposes allowing all domains.
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new [] { "*" });

            User user;
            AccountRepository accountRepository = _accountRepositoryFactory();
            try
            {
                user = await accountRepository.ValidateUser(context.UserName, context.Password);
            }
            finally
            {
                IDisposable accountRepositoryDisposable = accountRepository as IDisposable;
                if (accountRepositoryDisposable != null)
                {
                    accountRepositoryDisposable.Dispose();
                }
            }

            if (user == null)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, user.Name));
            identity.AddClaim(new Claim(ClaimTypes.Role, "user"));

            AuthenticationTicket ticket = new AuthenticationTicket(identity,
                new AuthenticationProperties(new Dictionary<string, string>()
                {
                    {"name", user.Name}
                }));

            context.Validated(ticket);
        }

        /// <summary>
        /// Called at the final stage of a successful Token endpoint request. An application may implement this call in order to do any final
        /// modification of the claims being used to issue access or refresh tokens. This call may also be used in order to add additional
        /// response parameters to the Token endpoint's json response body.
        /// </summary>
        /// <param name="context">The context of the event carries information in and results out.</param>
        /// <returns>
        /// Task to enable asynchronous execution
        /// </returns>
        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }
    }
}