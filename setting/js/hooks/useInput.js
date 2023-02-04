import { useState, useCallback } from 'react';

const useInput = () => {
  const [value, setValue] = useState('');
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return [value, handler, setValue];
};
export default useInput;
