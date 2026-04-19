import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T, Args extends any[]>(
  apiFunction: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setState({ data: null, loading: false, error });
        throw error;
      }
    },
    [apiFunction]
  );

  return { ...state, execute };
}
