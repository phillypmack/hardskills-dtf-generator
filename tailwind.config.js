/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4b2bee',
            },
            fontFamily: {
                sans: ['Space Grotesk', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
