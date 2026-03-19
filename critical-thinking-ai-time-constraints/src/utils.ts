export const shuffleArray=(arr:any)=> {
    for (let i = arr.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap current element with the element at the random index
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
