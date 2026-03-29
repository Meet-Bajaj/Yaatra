import { type DependencyList, useEffect, useRef, useState } from 'react';

export function useAsyncData<T>(loader: () => Promise<T>, dependencies: DependencyList = []) {
  const loaderRef = useRef(loader);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  const reload = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await loaderRef.current();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload().catch(() => undefined);
    // The caller controls reload timing via the dependency list passed to the hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    error,
    loading,
    reload,
    setData,
  };
}
