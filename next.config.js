const withSass = require('@zeit/next-sass');
const withCSS = require("@zeit/next-css");
const withPWA = require("next-pwa");
const withImages = require("next-images");

module.exports = withImages(withCSS(withSass(withPWA({
        pwa: {
                dest: "public"
        }
}))));