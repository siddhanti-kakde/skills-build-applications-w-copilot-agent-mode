import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/teams/`;
  }

  return 'http://localhost:8000/api/teams/';
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

function resolveName(member) {
  if (!member) {
    return 'Unknown';
  }

  if (typeof member === 'string') {
    return member;
  }

  return member.name || member.username || 'Unknown';
}

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchTeams = async () => {
      try {
        const response = await fetch(getApiBaseUrl());

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (isMounted) {
          setTeams(normalizeItems(payload));
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Unable to load teams.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-header bg-white border-0">
        <h2 className="h4 mb-0">Teams</h2>
      </div>
      <div className="card-body">
        {loading && <p className="text-muted mb-0">Loading teams...</p>}
        {!loading && error && (
          <div className="alert alert-danger mb-0" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="row g-3">
            {teams.length === 0 ? (
              <div className="col-12 text-center text-muted py-4">No teams available.</div>
            ) : (
              teams.map((team) => (
                <div className="col-md-6 col-xl-4" key={team._id || team.id || team.name}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h3 className="h5 mb-2">{team.name || 'Unnamed Team'}</h3>
                      <p className="text-muted mb-2">
                        Captain: <strong>{resolveName(team.captain)}</strong>
                      </p>
                      <p className="mb-2">
                        Members: <span className="badge text-bg-primary">{Array.isArray(team.members) ? team.members.length : 0}</span>
                      </p>
                      <ul className="list-unstyled mb-0">
                        {(Array.isArray(team.members) ? team.members : []).slice(0, 4).map((member, index) => (
                          <li key={`${team._id || team.name}-member-${index}`}>{resolveName(member)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
