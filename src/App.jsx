import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [userEvents, setUserEvents] = useState([]);

// To fetch username and its' data
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

      await fetchUserEvents();
    } catch (error) {
      setUserData(null);
      setError('Error fetching user data. Please try again.');
    }
  };

  // To fetch recent user events data
  const fetchUserEvents = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/events`);
      if (!response.ok) {
        throw new Error('Error fetching user events');
      }
      const events = await response.json();
  
      // Filter for push and pull request events
      const commitEvents = events.filter(
        (event) => event.type === 'PushEvent' || event.type === 'PullRequestEvent'
      );
  
      // Add relevant event data
      const eventDetails = commitEvents.map((event) => {
        const isPush = event.type === 'PushEvent';
        return {
          type: isPush ? 'Push' : 'Pull Request',
          repo: event.repo.name,
          time: event.created_at,
          commits: isPush ? event.payload.commits : [], // Only PushEvent has commits
        };
      });
  
      setUserEvents(eventDetails); // Update state with cleaned event data
    } catch (error) {
      console.error('Error fetching user events:', error);
      setError('Unable to fetch user events');
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
              className="w-36 h-36 border-2 border-yellow-500 rounded-full mx-auto"
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

        {userEvents.length > 0 && (
          <div className="bg-gray-800 ms-3 p-4 rounded-lg shadow-md w-full max-w-3xl">
            <h3 className="text-lg font-bold text-center mb-4 text-yellow-500">Recent GitHub Events</h3>
            <ul className="space-y-4">
              {userEvents.map((event, index) => (
                <li key={index} className="p-3 bg-gray-700 rounded-md">
                  <p>
                    <span className="font-bold text-white">{event.type}:</span> {event.repo}
                  </p>
                  {event.type === 'Push' && event.commits.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-300">
                      {event.commits.map((commit, idx) => (
                        <li key={idx}>
                          - <span className="font-medium">{commit.message}</span>{' '}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    Time: {new Date(event.time).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
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
