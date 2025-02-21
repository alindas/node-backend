module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  ignorePatterns: ["*.md", "*.yml"],
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:import/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }],
      ],
    },
  },
  settings: {
    "import/resolver": {
      "babel-module": {
        root: ["./src"],
        alias: {
          "@": "./src",
          "@root": ".",
          "@modules": "./src/modules",
        },
      },
      node: {
        extensions: [".js", ".json"],
        paths: ["src"],
      },
    },
  },
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "prettier/prettier": ["error", {}, { usePrettierrc: true }],
    "no-constant-condition": ["error", { checkLoops: false }],
    "no-async-promise-executor": "warn",
    "import/prefer-default-export": "off",
    "import/no-unresolved": [
      "error",
      {
        ignore: ["^@/", "^@root/", "^@modules/"],
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        json: "never",
      },
    ],
    "func-names": "off",
    "no-console": "off",
    "no-underscore-dangle": "off",
    "no-await-in-loop": "off",
    "no-param-reassign": "off",
    "class-methods-use-this": "off",
    "no-continue": "off",
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
    // "import/order": [
    //   "error",
    //   {
    //     groups: [
    //       "builtin", // 内置模块
    //       "external", // 外部模块
    //       "internal", // 内部模块
    //       ["parent", "sibling"], // 父级和兄弟模块
    //       "index", // 索引文件
    //       "object", // 对象导入
    //       "type", // 类型导入
    //     ],
    //     pathGroups: [
    //       {
    //         pattern: "@/**",
    //         group: "internal",
    //         position: "before",
    //       },
    //     ],
    //     "newlines-between": "never",
    //     alphabetize: {
    //       order: "asc",
    //       caseInsensitive: true,
    //     },
    //   },
    // ],
    "global-require": "off",
    "import/no-dynamic-require": "off",
  },
  globals: {
    process: true,
  },
};
