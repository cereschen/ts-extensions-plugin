# ts-extensions-plugin

find module Definitions in real path

so let file behavior like a module

## Usage
`npm i ts-extensions-plugin -D` or `yarn install ts-extensions-plugin -D`

```json
// tsconfig.json
{
  "compilerOptions": {
   "plugins": [{
    "name": "ts-extensions-plugin",
    "extensions":["vue","scss"]  // default ['vue','svelte', 'scss', 'css', 'less', 'png', 'svg']
    }]
  }
}

```
If you use vscode , please change typescript to workspace version

## Example
```ts
// shims-vue.d.ts
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
```
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

```
```ts
import Foo from '@/components/Foo/index.vue';  // work well 
```