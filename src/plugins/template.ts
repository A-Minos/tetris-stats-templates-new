export default defineNuxtPlugin((app) => {
    app.hooks.addHooks({
        'app:created': () => {
            navigateTo({
                path: window.__PATH__,
            });
        },
    });
});
