<h2 align="center">image-sequence-player</h2>

<p align="center">
  <a href="https://www.npmjs.com/package/image-sequence-player"><img src="https://img.shields.io/npm/v/image-sequence-player?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/@skywatch/js"><img src="https://img.shields.io/npm/dm/image-sequence-player?style=flat-square"></a>
</p>

A video player that playing video with image sequence.

## Installation

```
npm install image-sequence-player --save
```

or

```
yarn add image-sequence-player
```

CDN:

```
<script src="https://cdn.jsdelivr.net/npm/image-sequence-player/dist/lib.min.js"></script>
```

## Usage

```javascript
<body>
    <div id="my-player" class="frameplayer" data-vidsrc="./videos/s3.json"></div>
</body>
<script src="https://cdn.jsdelivr.net/npm/image-sequence-player/dist/lib.min.js"></script>
<script>
    var options = {
        rate: 1,
        controls: true,
        autoplay: true,
        backwards: false,
        startFrame: 0,
        width: '640px',
        height: '390px',
    };
    var player = new FramePlayer('my-player', options);
    player.play();
</script>
```

## Methods

| Method           | Parameters | Returns  | Description                                           |
| ---------------- | ---------- | -------- | ----------------------------------------------------- |
| `play()`         | None.      | Nothing. | Start playing the video.                              |
| `pause()`        | None.      | Nothing. | Pause the current video.                              |
| `resume()`       | None.      | Nothing. | Play the current video from the moment it was paused. |
| `gotoFrame(int)` | Integer.   | Nothing. | Jumps to a specific frame of the video.               |
| `reverse(bool)`  | Boolean.   | Nothing. | Reverses the video or not.                            |
| `fullscreen()`   | None.      | Nothing. | Fullscreen mode.                                      |

## Parameters

| Property           | Type     | Default | Description                                           |
| ------------------ | -------- | ------- | ----------------------------------------------------- |
| `rate`             | Number.  | 20      | Video frame rate.                                     |
| `controls`         | Boolean. | True    | Displaycontrol bar or not.                            |
| `autoplay`         | Boolean. | False   | If ture, it will play the video at the beginning.     |
| `width`            | String.  | '480px' | The width of video player.                            |
| `height`           | String.  | '320px' | The height of video player.                           |
| `startFrame`       | Number.  | 0       | Decide which frame will be play at the beginning.     |
| `backwards`        | Boolean. | False   | If true, the video will be reversed at the beginning. |
| `progressBarColor` | String.  | '#f00'  | The color of progress bar of current time.            |

## Note

- This project is inspired by [frame-player](https://github.com/vagnervjs/frame-player).
- Licensed under the Apache License, Version 2.0 (the "License");
