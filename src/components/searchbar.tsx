import React, { useState } from "react"

type userData = {
  login: string;
  avatar_url: string;
  followers: number;
  following: number;
  bio: string;
};


export const Searchbar = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<userData | null>(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);

  const onSearch = async () => {
    if (!username) return;
  
    try {
      setError(null);
      setUserData(null);
      setRepos([]);
      console.log(TOKEN)
      const userRes = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (!userRes.ok) {
        throw new Error(`Error fetching user: ${userRes.status}`);
      }

      const user = await userRes.json();
      setUserData(user);


      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=10&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/vnd.github+json",
          },
        }
      );

      if (!repoRes.ok) {
        throw new Error(`Error fetching repos: ${repoRes.status}`);
      }

      const repoData = await repoRes.json();
      setRepos(repoData);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
    }
  };
  return (
    <div>
      <h2>GitHub User Search</h2>

      <input
        id="username"
        name="username"
        type="search"
        autoComplete="off"
        placeholder="Search a GitHub user"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={onSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {userData && (
        <div style={{ marginTop: "1rem" }}>
          <h3>{userData.login}</h3>
          <img
            src={userData.avatar_url}
            alt={userData.login}
            width="80"
            style={{ borderRadius: "50%" }}
          />
          <p>{userData.bio}</p>
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>
        </div>
      )}

      {repos.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Public Repos</h4>
          <ul>
            {repos.map((repo: any) => (
              <li key={repo.id}>
                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  {repo.name}
                </a>
                <span> ⭐ {repo.stargazers_count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}