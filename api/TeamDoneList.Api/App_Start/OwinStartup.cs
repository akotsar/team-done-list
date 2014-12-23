using System;
using System.Web.Http;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Owin;
using TeamDoneList.Api;
using TeamDoneList.Api.Auth;
using TeamDoneList.Api.Models.Repositories;

[assembly: OwinStartup(typeof(OwinStartup))]
namespace TeamDoneList.Api
{
    /// <summary>
    /// Performs startup configuration of the Owin services.
    /// </summary>
    public class OwinStartup
    {
        /// <summary>
        /// The token expiration time.
        /// </summary>
        private static readonly TimeSpan AuthTokenExipration = TimeSpan.FromSeconds(10);

        /// <summary>
        /// The URL for token authentication.
        /// </summary>
        private const string AuthTokenUrl = "/auth/token";

        /// <summary>
        /// Configurations the specified application.
        /// </summary>
        /// <param name="app">The application.</param>
        public void Configuration(IAppBuilder app)
        {
            ConfigureOAuth(app);

            HttpConfiguration config = new HttpConfiguration();
            WebApiConfig.Register(config);
            app.UseCors(CorsOptions.AllowAll);
            app.UseWebApi(config);
        }

        /// <summary>
        /// Configures the authentication.
        /// </summary>
        /// <param name="app">The application.</param>
        private void ConfigureOAuth(IAppBuilder app)
        {
            OAuthAuthorizationServerOptions serverOptions = new OAuthAuthorizationServerOptions
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString(AuthTokenUrl),  // The URL for token authentication.
                AccessTokenExpireTimeSpan = AuthTokenExipration,
                Provider = new SimpleAuthorizationServerProvider(() =>  new AccountRepository()),
                RefreshTokenProvider = new SimpleRefreshTokenProvider()
            };

            // Token generation
            app.UseOAuthAuthorizationServer(serverOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }
    }
}