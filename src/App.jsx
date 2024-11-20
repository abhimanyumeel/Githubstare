import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const fetchUserData = async () => {
    if (username === '') {
      alert('Please enter a GitHub username!');
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      const data = await response.json();
      setUserData(data);
      setError('');
    } catch (error) {
      setUserData(null);
      setError('Error fetching user data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <header className="text-center mt-10">
        <h1 className="text-4xl font-bold">Git Stare</h1>
        <p className="mt-4 text-gray-300">Enter a GitHub username to view their details.</p>
      </header>
      <div className="mt-8 flex items-center gap-4">
        <input
          type="text"
          placeholder="Enter Username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-800 border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-500"
        />
        <button
          onClick={fetchUserData}
          className="px-4 py-2 bg-yellow-500 rounded-md text-black font-semibold hover:bg-yellow-600"
        >
          Search
        </button>
      </div>
      <div className="mt-8 w-full flex justify-center">
        {error && <p className="text-red-500 font-semibold">{error}</p>}
        {userData && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-80">
            <img
              src={userData.avatar_url}
              alt={`${username}'s avatar`}
              className="w-24 h-24 rounded-full mx-auto"
            />
            <h2 className="text-xl font-bold text-center mt-4">{userData.name || userData.login}</h2>
            <p className="text-center text-gray-400 mt-2">{userData.bio || 'No bio available'}</p>
            <div className="mt-4">
              <p className="text-sm">
                <span className="font-bold">Public Repos:</span> {userData.public_repos}
              </p>
              <p className="text-sm">
                <span className="font-bold">Public Gists:</span> {userData.public_gists}
              </p>
              <p className="text-sm">
                <span className="font-bold">Followers:</span> {userData.followers}
              </p>
              <p className="text-sm">
                <span className="font-bold">Following:</span> {userData.following}
              </p>
            </div>
            <a
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center text-yellow-500 hover:underline"
            >
              View Profile on GitHub
            </a>
          </div>
        )}
      </div>
      <footer className="mt-auto mb-4 text-gray-400">
        <p>Made By Abhimanyu Meel</p>
      </footer>
    </div>
  );
}

export default App;
