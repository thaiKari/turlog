export const createCopy = (toCopy: object) => {
    return JSON.parse(JSON.stringify(toCopy));
}