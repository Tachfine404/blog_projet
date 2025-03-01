const getImageUrl = (path) => {
    if (!path) return '';  // Retourner une chaîne vide au lieu de null
    if (path.startsWith('http')) return path;
    return `http://localhost:9000/${path.startsWith('/') ? path.slice(1) : path}`;  // Gestion correcte du slash
};

export default getImageUrl;
