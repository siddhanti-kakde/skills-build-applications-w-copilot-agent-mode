import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`;
  }

  return 'http://localhost:8000/api/leaderboard/';
}

function normalizeItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.results)) {
    return payload.results;
  }

  if (payload && Array.isArray(payload.items)) {
    return payload.items;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
}

function resolveName(item) {
  if (!item) {
    return 'Unknown';
  }

  if (typeof item === 'string') {
    return item;
  }

  return item.name || item.username || item.teamName || 'Unknown';
}

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(getApiBaseUrl());

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (isMounted) {
          setEntries(normalizeItems(payload));
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Unable to load leaderboard.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-header bg-white border-0">
        <h2 className="h4 mb-0">Leaderboard</h2>
      </div>
      <div className="card-body">
        {loading && <p className="text-muted mb-0">Loading rankings...</p>}
        {!loading && error && (
          <div className="alert alert-danger mb-0" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">User</th>
                  <th scope="col">Team</th>
                  <th scope="col">Score</th>
                  <th scope="col">Streak</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No leaderboard data available.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry, index) => (
                    <tr key={entry._id || entry.id || `leaderboard-${index}`}>
                      <td>#{index + 1}</td>
                      <td>{resolveName(entry.user)}</td>
                      <td>{resolveName(entry.team)}</td>
                      <td>{entry.score ?? 0}</td>
                      <td>{entry.streak ?? 0} days</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
