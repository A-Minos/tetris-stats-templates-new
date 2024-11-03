export default defineNuxtPlugin((app) => {
    app.hooks.addHooks({
        'app:created': () => {
            navigateTo({
                path: document.querySelector('template#path')!.innerHTML.trim(),
            });
        },
    });
});
