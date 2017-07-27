# Installing

First, clone this repository:
```
git clone https://github.com/naccib/fabricadenoobs-discordbot.git
```

Then, install all the dependencies:
```
yarn install # if you use yarn
npm install * # if you use npm
```

Now you are going to create a `config.ts` file in the `src` directory in the following format: 
```ts
/**
 * Standard configuration class. Just ensuring type safety.
 */
export interface IConfig
{
    token : string;
    prefixes: Array<string>;
};

/**
 * Configuration object.
 */
export const config: IConfig =
{
    token: 'YOUR-BOT-TOKEN',
    prefixes: ['&']
};
```

Then just build with:
```
yarn ts:build
```
And run with: ```
yarn ts:run
```