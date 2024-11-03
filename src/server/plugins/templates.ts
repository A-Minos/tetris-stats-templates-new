export default defineNitroPlugin((app) => {
    app.hooks.addHooks({
        'render:html': (html) => {
            html.bodyAppend.push('<template id="path"></template>');
            html.bodyAppend.push('<template id="data"></template>');
        },
    });
});
