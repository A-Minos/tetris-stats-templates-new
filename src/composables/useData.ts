export default <T extends object>(): T => {
    return JSON.parse(document.querySelector('template#data')!.innerHTML);
};
