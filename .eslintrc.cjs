module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    extends: [
        "eslint:recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
    ],
    overrides: [],
    plugins: ["react", "@typescript-eslint", "react-hooks"],
    rules: {},
}
