const {defineConfig} = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        testIsolation: false,
        watchForFileChanges: false,
        chromeWebSecurity: false,
        viewportWidth: 1366,
        viewportHeight: 768,
    },
});
