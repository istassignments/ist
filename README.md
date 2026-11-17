# Maison Sunday

## Run locally

```sh
node server.js
```

Open `http://localhost:3000`.

## Firebase Hosting

The Firebase project `styleai-dcac2` is selected in `.firebaserc`, and Hosting publishes the static `www` directory.

The Firebase CLI is installed at `$HOME/.local/bin/firebase` in this environment. Sign in and deploy from this directory with:

```sh
"$HOME/.local/bin/firebase" login
"$HOME/.local/bin/firebase" deploy --only hosting
```

You can add `$HOME/.local/bin` to your shell `PATH` to use the shorter `firebase` command.

## Cloudinary images

The storefront keeps using its local image files until Cloudinary delivery is enabled. Upload the five files in `www/assets/images/` to the Cloudinary account with cloud name `lf3nf08p`, using these public IDs:

| Image | Cloudinary public ID |
| --- | --- |
| `Floral Embroidered Corset Dress Flat Lay.png` | `maison-sunday/floral-embroidered-corset-dress` |
| `Pastel Swirl Resortwear Flat Lay.png` | `maison-sunday/pastel-swirl-resortwear` |
| `Cream Striped Vest Outfit Flat Lay.png` | `maison-sunday/cream-striped-vest-outfit` |
| `Pink Floral Sneakers with White Accents.png` | `maison-sunday/pink-floral-sneakers` |
| `Cognac Boots and Burgundy Knit Flat Lay.png` | `maison-sunday/cognac-boots-burgundy-knit` |

After all five uploads finish, set `useCloudinary` to `true` in `www/site-config.js`. The storefront then serves optimized Cloudinary image URLs. No Cloudinary API credentials are used by the website.
