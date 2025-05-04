/**
 * Gera um novo ID aleatório em formato hexadecimal.
 *
 * @returns {string} Um ID gerado combinando números aleatórios com a data atual.
 */
export function generateNewId() {
    const Id = Math.floor((Math.random() * Math.random()) * Date.now()).toString(16);
    return Id;
};
