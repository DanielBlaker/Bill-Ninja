# Bill-Ninja

Use your phone's gyroscope to bat expences into an approval or a rejection like a wii remote!

Streaming from Phone to Desktop using socket.io!

3D rendering on browsers using Three.js!

Physics by Oimo!

HTTPS forwarding by ngrok!

## Video Demo and Guide! 

[![Demo and Setup](https://markdown-videos-api.jorgenkh.no/url?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdP3nyd9NBjs)](https://www.youtube.com/watch?v=dP3nyd9NBjs)

Or see [here](./documents/Demo.mp4)

## Problems experianced on the project

During the hackathon we discovered that HTTP website was insufficient for collecting gyro data from a phone through a browser.
This meant that just connecting through the local network was not good enough, unless we could get signed certificates.
We had to get a HTTPS website, and the easiest way to do that was by forwarding using ngrok.

We were unable to get realistic transfer of momentum between the cricket bat and the blocks.
It is difficult because the bat was not allowed to float freely, it had to mirror the phone.
This means that when the bat moves, it does not have momentum, it does lots of little teleports every frame to match the phone.
Hence when the bat hits the blocks it can't transfer any momentum and the blocks would bounce off as if they hit a still object.
It might have been possible to hack around this given more time.
The position all calculations are performed using Quaternions, which are quite hard to work with for hacky off the cuff solutions.

## How run

1. Run ngrok forwarding

    ```ngrok http http://localhost:8080```

2. Start up server

    ```node server.js```

3. Load up website on mobile

    the ngrok url + `/mobile`, e.g. `https://c48d-1-145-211-46.ngrok-free.app/mobile`

4. Load up the website on desktop

    the ngrok url + `/desktop`, e.g. `https://c48d-1-145-211-46.ngrok-free.app/desktop`

5. Swing the phone to moke the cricket bat!


## A Hackathon project of Max Hunter and Daniel Blaker