import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const MyWorks = () => {
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("ManishK-Mky"); // Default GitHub username
  const [searchUser, setSearchUser] = useState("");
  const [languages, setLanguages] = useState<any>({});

  useEffect(() => {
    fetchGitHubData(username);
  }, [username]);

  const fetchGitHubData = async (user:any) => {
    try {
      const [repoRes, profileRes] = await Promise.all([
        axios.get(`https://api.github.com/users/${user}/repos`),
        axios.get(`https://api.github.com/users/${user}`)
      ]);

      const reposData = repoRes.data.slice(0, 6); // Show only 6 repos
      setRepos(reposData);
      setProfile(profileRes.data);

      // Fetch languages for each repo
      const langPromises = reposData.map((repo:any) =>
        axios.get(repo.languages_url)
      );

      const langResults = await Promise.all(langPromises);
      const langData:any = {};
      reposData.forEach((repo:any, index:any) => {
        langData[repo.id] = Object.keys(langResults[index].data).join(", ");
      });

      setLanguages(langData);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  };

  const handleSearch = () => {
    if (searchUser.trim() !== "") {
      setUsername(searchUser);
      setSearchUser("");
    }
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-6">My Works</h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search GitHub User..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="p-3 w-full max-w-md bg-gray-800 text-white rounded-l-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 px-4 py-3 rounded-r-md hover:bg-blue-600 transition"
        >
          🔍
        </button>
      </div>

      {/* Profile + Repos Layout */}
      <div className="flex flex-col md:flex-row gap-10 justify-center items-start">
        {/* GitHub Profile Section - Left Side */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
          >
            <img src={profile.avatar_url} alt="GitHub Avatar" className="w-24 h-24 rounded-full mb-3" />
            <h3 className="text-2xl font-bold">{profile.name || profile.login}</h3>
            <p className="text-gray-400">@{profile.login}</p>
            <div className="flex gap-4 mt-3">
              <p>👥 {profile.followers} Followers</p>
              <p>📦 {profile.public_repos} Repos</p>
            </div>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 mt-2 hover:underline"
            >
              View Profile →
            </a>
          </motion.div>
        )}

        {/* Repositories Section - Right Side */}
        <div className="w-full md:w-2/3 flex flex-wrap justify-center gap-6">
          {repos.map((repo:any, index:any) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 w-full md:w-5/12 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
            >
              <h3 className="text-xl font-semibold">{repo.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-400">🛠 {languages[repo.id] || "Unknown"}</p>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyWorks;
