# Hatena Burokku

_トゲハテナブロック_ (_hatena burokku_) is Japanese for [_interrogation block_ ⍰](https://www.mariowiki.com/%3F_Block).

## Building the app

The app is in `/src`. Assets called by the app needs to be compiled using some front-end tooling, detailed below.

### Development

1. Duplicate `.env.example` to `.env` and edit it.
2. Run `npm install` (Node > 12.13) to install all the required packages and tools.
3. Run `npm run dev` and open the URL returned by the CLI.

Note: the Service Worker is broken while developing. Ignore it and check it using the [production](#production) mode.

### Production

1. Duplicate `.env.example` to `.env` and edit it.
2. Run `npm install` (Node > 14.18) to install all the required packages and tools.
3. Run `npm run build` to compile the app. The compiled app goes in `/public`.
4. Run `npm run preview` to preview it on your machine.

### Tests

Tests use [Playwright](https://playwright.dev) and can be run with `npm test`. They can all run locally or in a GitHub action.

Before running tests locally:
- `npx playwright install` pulls the headless browsers used by the test;
- (optional) set the test URL in the `PW_BASE_URL` entry of your `.env`.

You can also play with Playwright GUI by running `npm run test:ui`.

External URLs are tested on merge requests using [Lychee](https://lychee.cli.rs) in a GitHub Action. To test URLs locally install Lychee and run `npm run test:absolute-links`.

#### Local tests results

When running the tests locally, the results are in `/tests/results`:
- `{timestamp}.json`: JSON report of the test suites;
- `html/index.html`: HTML report of the latest test suites.

#### GitHub Action tests results

When running in a GitHub action, the “summary” view of the GitHub Action has an _artifact_ section at the very bottom. The artifact archive contains the same HTML report as in `html/index.html` when you run tests locally.

### Various

- Files in `/src/public` are copied as is (respecting the directory structure in `/src/public`) in the build directory.
- Lint JavaScript: `npm run lint` to scan for errors or `npm run lint-fix` to try an automatic fix.

## Some audio operations with ffmpeg

When adding a new block, sounds must be provided [in FLAC and WAV](#convert-wav-to-flac) (WAV is the fallback). Then, their [volume needs to be adjusted](#sounds-normalization).

### Convert WAV to FLAC

`ffmpeg -i my-sound.wav -c:a flac my-sound.flac`

### Sounds normalization

Normalizing sounds means (in our case, but [there is](https://trac.ffmpeg.org/wiki/AudioVolume) [more](https://superuser.com/questions/323119/how-can-i-normalize-audio-using-ffmpeg/323127#323127)) aligning the maximum volume of several sounds, so that there’s no sound effect sounding too loud or too quiet compared to the others.

First, run `ffmpeg -i my-sound.wav -filter:a volumedetect -f null /dev/null` to detect the volume profile ([official doc](https://ffmpeg.org/ffmpeg-filters.html#volumedetect)) on your audio files. The audio profile of a file could be:

```
[Parsed_volumedetect_0 @xxx] mean_volume: -19.3 dB
[Parsed_volumedetect_0 @xxx] max_volume: -2.7 dB
[Parsed_volumedetect_0 @xxx] histogram_2db: 2
[Parsed_volumedetect_0 @xxx] histogram_3db: 8
```

Among your files, the loudest will have its `max_volume` closer to 0 dB. You can normalize to whatever file you want by running a command on each audio file in order to increase or decrease their volume by a few dB.

If the audio file sounds too loud (`max_volume: -2.7 dB`), we can normalize it to another one having (for example) `max_volume: -8 dB`. The gap between the 2 files is 6 dB (5.3 dB rounded to the upper integer), so we’ll decrease the loudest file by 6 dB by running:

`ffmpeg -i my-sound.wav -filter:a "volume=-6dB" my-sound-normalized.wav`

## Special thanks

Thanks to [themushroomkingdom.net](https://themushroomkingdom.net) and all the people running Nintendo fans sites since the previous century!

## Various

Last deployment:

[![Laravel Forge Site Deployment Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fforge.laravel.com%2Fsite-badges%2Fb01968f7-ee1c-4f3e-9d8d-905326620747%3Fdate%3D1%26commit%3D1&style=for-the-badge)](https://forge.laravel.com)
