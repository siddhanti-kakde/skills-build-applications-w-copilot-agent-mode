import { useEffect, useState } from 'react';

function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev/api/workouts/`;
  }

  return 'http://localhost:8000/api/workouts/';
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

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchWorkouts = async () => {
      try {
        const response = await fetch(getApiBaseUrl());

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (isMounted) {
          setWorkouts(normalizeItems(payload));
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Unable to load workouts.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWorkouts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="card shadow-sm border-0">
      <div className="card-header bg-white border-0">
        <h2 className="h4 mb-0">Workouts</h2>
      </div>
      <div className="card-body">
        {loading && <p className="text-muted mb-0">Loading workouts...</p>}
        {!loading && error && (
          <div className="alert alert-danger mb-0" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="row g-3">
            {workouts.length === 0 ? (
              <div className="col-12 text-center text-muted py-4">No workouts available.</div>
            ) : (
              workouts.map((workout) => (
                <div className="col-md-6 col-xl-4" key={workout._id || workout.id || workout.name}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h3 className="h5 mb-2">{workout.name || 'Workout'}</h3>
                      <p className="text-muted mb-2">{workout.focus || workout.type || 'General fitness'}</p>
                      <div className="d-flex justify-content-between">
                        <span>Duration</span>
                        <strong>{workout.duration || workout.minutes || '—'} min</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Difficulty</span>
                        <strong>{workout.difficulty || 'Moderate'}</strong>
                      </div>
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
