import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/users/`;
  }

  return 'http://localhost:8000/api/users/';
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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const response = await fetch(getApiBaseUrl());

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (isMounted) {
          setUsers(normalizeItems(payload));
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Unable to load users.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-header bg-white border-0">
        <h2 className="h4 mb-0">Users</h2>
      </div>
      <div className="card-body">
        {loading && <p className="text-muted mb-0">Loading users...</p>}
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
                  <th scope="col">Name</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Fitness Goal</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No users available.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id || user.id || user.email || user.username}>
                      <td>{user.name || 'Unknown'}</td>
                      <td>{user.username || '—'}</td>
                      <td>{user.email || '—'}</td>
                      <td>{user.goal || user.fitnessGoal || 'General fitness'}</td>
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
