# Garden Loft App

The Garden Loft App is a full-featured smart living platform designed to enhance resident independence and streamline support staff coordination in modern micro-living environments.

Built with **Expo**, **React Native**, **Firebase**, **Supabase**, **Home Assistant**, and **VideoSDK**, the app empowers users with communication, automation, safety, and wellness tools—accessible from both mobile and web.

---

## Features

### Social & Communication
- Friend Requests & Messaging
- Video Calling with Call Notifications (VideoSDK + Expo Notifications)
- Push Notifications for incoming calls and texts

### Smart Home Integration
- Control lights, A/C, media, and door locks (Home Assistant API)
- Live Doorbell Camera with WebRTC stream
- Real-time water, motion, and power usage logs (Supabase + HA sensors)

### Resident Monitoring
- Sleep & Bathroom tracking (Tochtech BPConnect API)
- AI-powered behavior analysis & daily summaries
- 24-hour activity timelines and usage graphs

### Booking & Support
- Service and class booking (Periodic API integration)
- Support staff dashboard for status overview
- Task & routine tracking for home care

---

## Tech Stack

| Layer              | Technology                                    |
|-------------------|-----------------------------------------------|
| Mobile App        | React Native + Expo                           |
| Backend           | Firebase Firestore & Auth, Supabase           |
| IoT Integration   | Home Assistant (Z-Wave, RTSP, MQTT, etc.)     |
| Video Calls       | VideoSDK (WebRTC)                             |
| Notifications     | Expo Notifications                            |
| AI & Analytics    | Supabase Edge Functions, Python backend       |

---

## Installation (Dev)

```bash
git clone https://github.com/gardenloft/garden-loft-app.git
cd garden-loft-app
npm install
npx expo start
