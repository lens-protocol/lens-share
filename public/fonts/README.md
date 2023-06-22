## Disclaimer

Although with [Local Fonts](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#local-fonts) the font files could be colocate within the `app` folder, we opted to keep them in `public/fonts` so that it's possible to reference them from `fs.readFileSync` so to be used in `ImageResponse`.
