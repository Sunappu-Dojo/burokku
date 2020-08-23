# Hatena Burokku

_トゲハテナブロック_ (_hatena burokku_) is Japanese for [_interrogation block_ ⍰](https://www.mariowiki.com/%3F_Block).

## Development

- duplicate `.env.example` to `.env` and edit it.
- `npm i && npm run dev`
- `npm run watch`
- (service worker watch, optional) `npm run sw-watch`

## Production

- duplicate `.env.example` to `.env`
- `npm i`
- `npm run prod`

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
