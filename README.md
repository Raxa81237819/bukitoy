# Star Kids Playground

Seven space-themed games for little kids, in one installable web app that works offline.

| App | File | What it does |
|---|---|---|
| Planet Tour | apps/planet.html | Endless full-screen cards from the Sun to Pluto (with the Moon and the asteroid belt). Rotating planets, twinkling stars, shooting stars, a 1-minute looping music track, and a Listen button read by a female voice. |
| Talking Kitten | apps/kitten.html | Pet the head (purr), tummy (meow), tail (mad) or paws (play). Tap the mic once: the kitten listens hands-free and repeats what you say in your own voice, sped up and squeaky. |
| Color Planets | apps/coloring.html | Seven planet pictures split into parts. Tap a part, pick a color and brush size from the pop-up, then rub your finger to color it in. Paint only shows inside the chosen part, like coloring inside the lines. A fully colored copy shows what to aim for (tap it to see it big, and a ⭐ marks the matching color). Undo, start over, save as a picture. Your coloring is remembered. |
| Planet Popper | apps/target.html | Pull the slingshot, fire the asteroid at a passing planet. Hits burst, misses say "Uh-oh!". |
| Shape Match | apps/shapes.html | Drag friendly shapes into their outlines. Chimes, confetti and spoken shape names. |
| Music Band | apps/music.html | Piano (C to C with sharps and flats), rainbow xylophone, guitar (G-key chords from the circle of fifths, strum or pluck), drums + tambourine, saxophone (7 notes, up to 3 at once) and a violin string band (cello, violin, harp; bow or pluck). |
| Feed the Animals | apps/feeding.html | Drag each food to the animal that eats it. Munching and hearts when right, "Yuck!" when wrong. |

## Putting it online (needed for install + offline)

Phones only allow install and offline mode on a **https** website. Upload the whole folder, keeping its structure, to any static host, for example:

- **Netlify Drop**: drag the folder onto app.netlify.com/drop
- **GitHub Pages**: push the folder to a repository and turn on Pages
- **Firebase Hosting**, **Cloudflare Pages** or **Vercel** also work

Then open the site on the phone:
- **Android (Chrome)**: tap **Install on this device** on the home page, or menu → *Install app*.
- **iPhone/iPad (Safari)**: tap **Share** → **Add to Home Screen**.

The first visit saves every game for offline use; a small status bubble in the lower right shows the progress.

To test on a computer: run `python3 -m http.server 8080` in this folder and open http://localhost:8080. Opening the files by double-click works for playing, but not for install or offline.

## Good to know

- **All sound is made in code** (music, instruments, purrs, pops, munches), so there are no audio files to download and everything works offline.
- **Voices** come from the device's built-in text-to-speech. The apps pick a female voice when the device has one (for example Samantha on iPhone, Google UK English Female on Android/Chrome). Browsers can't record that voice into a file, so it can't be embedded.
- **Talking Kitten** records your voice and plays it back squeaky, all on the device (nothing is sent anywhere). It works in any modern browser and needs microphone permission. On phones the page must be on an https address.
- **assets/audio** is empty and ready if you later want real recordings.
- Progress (stars, scores, coloring, sound on/off) is kept on each device.

## Planet maps (Planet Tour)

Planet Tour wraps its own surface maps around the spinning globes. They live in **assets/images** and were made from the Solar Voyage planet code, so no downloads or credits are needed. If a file goes missing, that planet is drawn by the page instead.

Tap **Listen** on any planet to hear about it.
