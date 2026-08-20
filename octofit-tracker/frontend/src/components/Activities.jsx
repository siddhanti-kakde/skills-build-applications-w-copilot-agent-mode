import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/activities/`;
  }

  return 'http://localhost:8000/api/activities/';
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

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchActivities = async () => {
      try {
        const response = await fetch(getApiBaseUrl());

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (isMounted) {
          setActivities(normalizeItems(payload));
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Unable to load activities.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderUserName = (user) => {
    if (!user) {
      return 'Unknown';
    }

    if (typeof user === 'string') {
      return user;
    }

    return user.name || user.username || 'Unknown';
  };

  return (
    <section className="card shadow-sm border-0">
      <div className="card-header bg-white border-0">
        <h2 className="h4 mb-0">Activities</h2>
      </div>
      <div className="card-body">
        {loading && <p className="text-muted mb-0">Loading activities...</p>}
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
                  <th scope="col">Date</th>
                  <th scope="col">User</th>
                  <th scope="col">Type</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No activities available.
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity._id || activity.id || `${activity.date}-${activity.type}`}>
                      <td>
                        {activity.date || activity.createdAt
                          ? new Date(activity.date || activity.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                      <td>{renderUserName(activity.user)}</td>
                      <td>{activity.type || 'Workout'}</td>
                      <td>{activity.duration || activity.minutes || '—'} mins</td>
                      <td>{activity.notes || activity.description || '—'}</td>
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
