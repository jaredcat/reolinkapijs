<h1 align="center"> Reolink Javascript API Client </h1>

<p align="center">
 <img alt="GitHub" src="https://img.shields.io/github/license/ReolinkCameraAPI/reolinkapipy?style=flat-square">
 <img alt="GitHub tag (latest SemVer)" src="https://img.shields.io/github/v/tag/ReolinkCameraAPI/reolinkapipy?style=flat-square">
 <img alt="Discord" src="https://img.shields.io/discord/773257004911034389?style=flat-square">
</p>

---

A Reolink Camera client written in Javascript. This repository's purpose is to deliver a complete API for the Reolink Cameras,
although they have a basic API document - it does not satisfy the need for extensive camera communication.

Check out our documentation for more information on how to use the software at [https://reolink.oleaintueri.com](https://reolink.oleaintueri.com)

Other Supported Languages:

- python: [reolinkapipy](https://github.com/ReolinkCameraAPI/reolinkapipy)
- Go: [reolinkapigo](https://github.com/ReolinkCameraAPI/reolinkapigo)

---

### Get started

Implement a "Camera" object by passing it an IP address, Username and Password. By instantiating the object, it will try retrieve a login token from the Reolink Camera. This token is necessary to interact with the Camera using other commands.

See the `examples` directory.

### Using the library as a Javascript package

## Contributors

---

### Styling and Standards

This project intends use prettier and eslint

### How can I become a contributor?

#### Step 1

Get the Restful API calls by looking through the HTTP Requests made in the camera's web UI. I use Google Chrome developer mode (ctr + shift + i) -> Network.

#### Step 2

- Fork the repository
- `npm install`
- Make your changes

#### Step 3

Make a pull request.

### API Requests Implementation Plan

Stream:

- [x] Blocking RTSP stream
- [x] Non-Blocking RTSP stream

GET:

- [x] Login
- [x] Logout
- [x] Display -> OSD
- [x] Recording -> Encode (Clear and Fluent Stream)
- [x] Recording -> Advance (Scheduling)
- [x] Network -> General
- [x] Network -> Advanced
- [x] Network -> DDNS
- [x] Network -> NTP
- [x] Network -> E-mail
- [x] Network -> FTP
- [x] Network -> Push
- [x] Network -> WIFI
- [x] Alarm -> Motion
- [x] System -> General
- [x] System -> DST
- [x] System -> Information
- [ ] System -> Maintenance
- [x] System -> Performance
- [ ] System -> Reboot
- [x] User -> Online User
- [x] User -> Add User
- [x] User -> Manage User
- [x] Device -> HDD/SD Card
- [x] PTZ -> Presets, Calibration Status
- [ ] Zoom
- [ ] Focus
- [ ] Image (Brightness, Contrast, Saturation, Hue, Sharp, Mirror, Rotate)
- [ ] Advanced Image (Anti-flicker, Exposure, White Balance, DayNight, Backlight, LED light, 3D-NR)
- [x] Image Data -> "Snap" Frame from Video Stream

SET:

- [x] Display -> OSD
- [x] Recording -> Encode (Clear and Fluent Stream)
- [ ] Recording -> Advance (Scheduling)
- [x] Network -> General
- [x] Network -> Advanced
- [ ] Network -> DDNS
- [ ] Network -> NTP
- [ ] Network -> E-mail
- [ ] Network -> FTP
- [ ] Network -> Push
- [x] Network -> WIFI
- [ ] Alarm -> Motion
- [ ] System -> General
- [ ] System -> DST
- [x] System -> Reboot
- [x] User -> Online User
- [x] User -> Add User
- [x] User -> Manage User
- [x] Device -> HDD/SD Card (Format)
- [x] PTZ (including calibrate)
- [x] Zoom
- [x] Focus
- [x] Image (Brightness, Contrast, Saturation, Hue, Sharp, Mirror, Rotate)
- [x] Advanced Image (Anti-flicker, Exposure, White Balance, DayNight, Backlight, LED light, 3D-NR)

### Supported Cameras

Any Reolink camera that has a web UI should work. The other's requiring special Reolink clients
do not work and is not supported here.

- RLC-411WS
- RLC-423
- RLC-420-5MP
- RLC-410-5MP
- RLC-510A
- RLC-520
- C1-Pro
- D400
- E1 Zoom
