```

██╗     ███████╗███╗   ██╗███████╗    ███████╗██╗  ██╗ █████╗ ██████╗ ███████╗
██║     ██╔════╝████╗  ██║██╔════╝    ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝
██║     █████╗  ██╔██╗ ██║███████╗    ███████╗███████║███████║██████╔╝█████╗
██║     ██╔══╝  ██║╚██╗██║╚════██║    ╚════██║██╔══██║██╔══██║██╔══██╗██╔══╝
███████╗███████╗██║ ╚████║███████║    ███████║██║  ██║██║  ██║██║  ██║███████╗
╚══════╝╚══════╝╚═╝  ╚═══╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝

```

The primary purpose of this repository is to implement the [LIP-3](https://github.com/lens-protocol/LIPs/pull/6).

- [Lens Share Link](#lens-share-link)
  - [Publication Lens Share Link](#publication-lens-share-link)
  - [Profile Lens Share Link](#profile-lens-share-link)
- [Lens Share UI](#lens-share-ui)
- [Lens Share App Manifest](#lens-share-app-manifest)
  - [JSON Schema `$id`](#json-schema-id)
- [Contributing](#contributing)
  - [Development workflow](#development-workflow)
  - [Add your app manifest](#add-your-app-manifest)
- [License](#license)
- [Support](#support)

## Lens Share Link

Lens Share Link is a standardized URL that can be used to share publication and profile on social media, chat, and other Lens apps.

### Publication Lens Share Link

The Lens Share Link format is:

```
https://share.lens.xyz/p/<id>[?by=<appId>]

```

Where:

- `<id>` is the publication ID.
- `<appId>` is an optional parameter that reflect the Lens App ID of the app used to generate the Lens Share Link. This is used to give priority to the app that generated the Lens Share Link when the user opens the Lens Share Link.

Some examples:

- `https://share.lens.xyz/p/0x01`
- `https://share.lens.xyz/p/0x01?by=lenster`
- `https://share.lens.xyz/p/0x01?by=orb`

### Profile Lens Share Link

The Lens Share Link format is:

```
https://share.lens.xyz/u/<handle>[?by=<appId>]
```

Where:

- `<handle>` is the profile handle inclusive of the `.lens` suffix but without the `@` prefix (e.g. `alice.lens`, `bob.lens`, etc.).
- `<appId>` is an optional parameter that reflect the Lens App ID of the app used to generate the Lens Share Link. This is used to give priority to the app that generated the Lens Share Link when the user opens the Lens Share Link.

Some examples:

- `https://share.lens.xyz/u/alice.lens`
- `https://share.lens.xyz/u/alice.lens?by=lenster`

## Lens Share UI

Lens Share UI is the web app implemented in this repository that is used to render Lens Share Links.

Some Lens apps are capable of supporting deep linking to specific publication or profile. Not all apps support profiles and publications. Among the apps that support publications some are more suitable to render text posts, video posts, audio posts, and so on.

**The Lens Share UI gives the user the option to open the Lens Share Link in the app that best support the Lens Share Link.**

The Lens Share UI is also responsible to render [Open Graph](https://ogp.me/) and [Twitter Card](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup) meta tags that are used by social media to render a nice preview of the Lens Share Link.

## Lens Share App Manifest

Lens Share App Manifest is a specification app metadata (e.g. name, description, routes, etc.) that is used by the Lens Share UI to show the list of apps the user can choose from when opening an Lens Share Link.

### JSON Schema `$id`

Every App Manifest MUST pass the App Manifest JSON Schema validation.

You can add the following JSON Schema `$id` to your App Manifest to have a better DX as well as inform any JSON schema validation tool to what schema your App Manifest is conforming to:

```json
{
  "$id": "https://share.lens.xyz/schemas/1.0.0/app-manifest"
  "name": "My Lens App",
  "appId": "my-lens-app"
}
```

## Contributing

We encourage all Lens apps builders to submit a PR against this repository with the app manifest(s) that they want to be listed.

### Development workflow

After cloning the repo, run `pnpm install` to fetch its dependencies. Then you can use several commands:

- `pnpm lint` to check code style. Run `pnpm lint -- --fix` to automatically fix all issues that do not require human intervention.
- `pnpm dev` to run the local development server (listening on `http://localhost:3000`)
- `pnpm build` to build the project for production deployments
- `pnpm start` to run a built project.
- `pnpm test:dev` to run e2e Playwright tests against a running instance (e.g. while you run `pnpm dev` on another terminal)

### Add your app manifest

[TBD]

## License

Lens Share is [MIT licensed](./LICENSE)

## Support

See the Lens API and SDK channel on our [Discord](https://discord.gg/lensprotocol)
