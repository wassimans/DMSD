# FAQ

## How do I deploy this?

Definitely go with what you have previous experience and are comfortable with. Otherwise here are two great choices

1. [Vercel](https://vercel.com/evmts) is a great choice because of how easy it is to deploy to. It will allow you to focus on building your app
2. [Fleek](https://fleek.co/) is a great web3 native choice that we used sometimes at OP labs. It allows you to deploy both to a CDN and to IPFS with minimal setup with a similar experience to vercel

**Note:** Getting forge to build on vercel can be a blocker. To make it easier for hackers there is a `npm run build:production` command that does not build forge before building

You can also just be happy using local host :).

## I need a backend?

You got lots of choices here

- [the graph](https://thegraph.com/) is the most web3 native way but requires knowledge of graphql
- [TRPC](https://trpc.io/) to move fast and would work very well at a hackathon
- [Ponder](https://github.com/0xOlias/ponder) is a graphql alternative with an aim of better dev experience but is early in it's own development
- [express](https://expressjs.com/) is the most well documented backend choice

The easiest place to deploy your backend fast and for free are the following

- [Render](https://render.com/)
- [Railway](https://railway.app/)

## Why wagmi

Wagmi is a typesafe library based around [React Query](https://react-query-v3.tanstack.com/) that simplifies and speeds up the process of building web3 frontends

## Why Forge

Forge is a superfast and robust toolchain that reduces context switching, speeds up development, and tends to be easier to use than alternatives even for JavaScript Devs

## Why Vite

Compared to NEXT.js vite is a better choice for a hackathon. It has a faster and better dev server, is simpler, and very easy to deploy since it's build output is just static assets. That said, NEXT.js is also a great choice and we recomend using [Wagmi CLI](https://wagmi.sh/cli/create-wagmi) if you believe NEXT.js would be more productive for your project

## Why npm?

NPM is the most minimal tool and we don't want you fighting your tooling at this hackathon. That said, you can definitely consider using [pnpm](https://pnpm.io/cli/install) which will speed up your installs. To use pnpm just run `npm i pnpm --global` and then run `pnpm import` to transfer the package-lock.json

## Why wagmi cli?

Try it out! You will be amazed at how much it will streamline your workflow of going from contract to UI.
