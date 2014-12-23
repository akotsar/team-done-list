using System;
using System.Threading.Tasks;

namespace TeamDoneList.Api.Models.Repositories
{
    /// <summary>
    /// A repository class for managing user accounts.
    /// </summary>
    public class AccountRepository : IDisposable
    {
        /// <summary>
        /// Indicates whether the object has been disposed.
        /// </summary>
        private bool _disposed = false;

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="user">The user information to register.</param>
        public async Task RegisterUser(SignupUserModel user)
        {
            // @TODO: Implement actual user registration.
        }

        /// <summary>
        /// Validates a user by email and password.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <param name="password">The password.</param>
        /// <returns>The validated user, when successful.</returns>
        public async Task<User> ValidateUser(string email, string password)
        {
            // @TODO: Implement actual user validation.
            return new User
            {
                Email = email,
                Name = "Test User"
            };
        }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            if (_disposed)
            {
                return;
            }

            _disposed = true;

            // @TODO: Implemnt releasing of resources (db context) when the class is fully implemented.
        }
    }
}