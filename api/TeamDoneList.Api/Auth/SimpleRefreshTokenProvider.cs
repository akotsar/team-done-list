using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Infrastructure;

namespace TeamDoneList.Api.Auth
{
    /// <summary>
    /// A provider for refresh tokens.
    /// </summary>
    public class SimpleRefreshTokenProvider : IAuthenticationTokenProvider
    {        
        /// <summary>
        /// Keeps refresh tokens.
        /// IMPORTANT: Since the refresh token are stored in memory, the solution is NON SCALABLE. The tokens
        /// will have to be stored in the DB in order to be able to scale.
        /// </summary>
        private static readonly ConcurrentDictionary<Guid, AuthenticationTicket> RefreshTokens = new ConcurrentDictionary<Guid, AuthenticationTicket>();

        /// <summary>
        /// Creates a new refresh token.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns>A promise.</returns>
        public async Task CreateAsync(AuthenticationTokenCreateContext context)
        {
            RemoveExpiredTokens();

            Guid refreshToken = Guid.NewGuid();

            var refreshTokenProperties = new AuthenticationProperties(context.Ticket.Properties.Dictionary)
            {
                IssuedUtc = context.Ticket.Properties.IssuedUtc,
                ExpiresUtc = DateTime.UtcNow.AddMinutes(5)
            };

            var refreshTokenTicket = new AuthenticationTicket(context.Ticket.Identity, refreshTokenProperties);

            //saving the new refreshTokenTicket to a local var of Type ConcurrentDictionary<string,AuthenticationTicket>
            // consider storing only the hash of the handle
            RefreshTokens.TryAdd(refreshToken, refreshTokenTicket);            
            context.SetToken(refreshToken.ToString("N"));
        }

        /// <summary>
        /// Receives a refresh token.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns>A promise.</returns>
        public async Task ReceiveAsync(AuthenticationTokenReceiveContext context)
        {
            Guid refreshToken;
            AuthenticationTicket ticket;

            if (Guid.TryParse(context.Token, out refreshToken) && RefreshTokens.TryRemove(refreshToken, out ticket))
            {
                context.SetTicket(ticket);
            }
        }

        /// <summary>
        /// Creates a new refresh token.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns>A promise.</returns>
        public void Create(AuthenticationTokenCreateContext context)
        {
            CreateAsync(context).Wait();
        }

        /// <summary>
        /// Receives a refresh token.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns>A promise.</returns>
        public void Receive(AuthenticationTokenReceiveContext context)
        {
            ReceiveAsync(context).Wait();
        }

        /// <summary>
        /// Removes the expired tokens.
        /// </summary>
        private void RemoveExpiredTokens()
        {
            DateTime utcNow = DateTime.UtcNow;

            // Creating a copy of the dictionary contents.
            var items = RefreshTokens.ToArray();
            foreach (var item in items)
            {
                if (item.Value.Properties.ExpiresUtc < utcNow)
                {
                    AuthenticationTicket tempValue;
                    RefreshTokens.TryRemove(item.Key, out tempValue);
                }
            }
        }
    }
}