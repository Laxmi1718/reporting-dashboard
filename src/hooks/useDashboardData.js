import { useCallback, useEffect, useState } from 'react';
import { fetchDashboardReport } from '../services/api';

export default function useDashboardData(filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await fetchDashboardReport(filters);
      setData(report);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // load() sets loading/error state before its first await; this is the
    // standard fetch-on-filter-change pattern, not an unintended cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
