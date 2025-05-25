// postcss.config.js
export default {
    plugins: {
        cssnano: process.env.NODE_ENV === 'minify' ? {} : false,
    }
};
