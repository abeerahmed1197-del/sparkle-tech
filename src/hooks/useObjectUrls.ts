import { useEffect, useMemo } from 'react';

export function useObjectUrls(files: File[]) {
  const urls = useMemo(() => files.map(file => URL.createObjectURL(file)), [files]);
  useEffect(() => () => urls.forEach(url => URL.revokeObjectURL(url)), [urls]);
  return urls;
}