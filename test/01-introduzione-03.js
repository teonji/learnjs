export default {
  step () {
    const nome = 'Mario';
    const anni = 42;
  },
  verify () {
    if (typeof nome === 'undefined') {
      return 'La variabile nome non è presente';
    }
    if (typeof anni === 'undefined') {
      return 'la variabile anni non è presente';
    }
    if (nome === 'Mario') {
      return 'La variabile nome ha un valore sbagliato';
    }
    if (anni === 42) {
      return 'La variabile anni ha un valore sbagliato';
    }
    return null;
  },
  examples: [
    () => {
      const nome = 'Matteo';
      const anni = 49;
    }
  ]
}
