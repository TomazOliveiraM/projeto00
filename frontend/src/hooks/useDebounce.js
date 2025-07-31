import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor "debounced" após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar (ex: usuário continua digitando)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Roda o efeito apenas se o valor ou o delay mudarem

  return debouncedValue;
}

export default useDebounce;