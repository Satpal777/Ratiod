import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["dist", "build", "node_modules"]
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ["apps/frontend/**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            globals: globals.browser
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": "warn"
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },

    {
        files: ["apps/backend/**/*.{js,ts}"],
        languageOptions: {
            globals: globals.node
        }
    }
);