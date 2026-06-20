# SentryFlow Console

## Overview

SentryFlow Console is a React-based monitoring dashboard designed to help developers track, analyze, and manage application errors and warnings in real time. The platform provides live log streaming, advanced filtering, alert configuration, server monitoring, and error frequency analysis through an intuitive user interface.

The project was developed to solve the challenge of efficiently monitoring large volumes of application logs while maintaining high performance and usability.

---

## Problem Statement

Build a control panel for checking all the error and warning messages (logs) from a running application, showing what went wrong and graphing how often it happens.

---

## Features

### 1. Live Log Stream

* Displays incoming error and warning logs in real time.
* Automatically updates as new logs arrive.
* Provides instant visibility into application issues.

### 2. Error Filter System

* Filter logs by error categories.
* Group related errors together.
* Undo filter changes to restore previous views.

### 3. Alert Setup Tool

* Configure notification rules based on error thresholds.
* Supports custom alert conditions.
* Helps teams respond quickly to critical issues.

### 4. Lag-Free Log History

* Efficiently renders large datasets using virtualization.
* Smooth scrolling through thousands of log entries.
* Optimized for performance and scalability.

### 5. Frequency Tracker

* Calculates error occurrence frequency in real time.
* Ranks errors based on frequency.
* Identifies recurring issues quickly.

### 6. Server Status Hub

* Displays server health and status information.
* Centralized monitoring of application infrastructure.
* Provides operational visibility.

### 7. Graph Crash Safety

* Implements Error Boundaries for graph components.
* Prevents dashboard crashes caused by visualization failures.
* Displays fallback summaries when errors occur.

### 8. Custom Search Filter

* Supports powerful RegEx-based log searching.
* Allows advanced pattern matching.
* Helps locate specific issues within large log datasets.

---

## Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* Vite

### State Management

* Redux Toolkit

### Styling

* CSS3
* Responsive Design

### Data Visualization

* Recharts

### Performance Optimization

* React Virtualization Techniques
* Memoization

### Development Tools

* Node.js
* npm
* Git & GitHub

---

## 📁 Project Structure

text
sentryflow-console/
├── src/
│   ├── components/
│   │   ├── AlertForm.jsx
│   │   ├── ErrorFilterPanel.jsx
│   │   ├── ErrorFrequencyChart.jsx
│   │   ├── FrequencyTracker.jsx
│   │   ├── GraphErrorBoundary.jsx
│   │   ├── LiveLogStream.jsx
│   │   ├── RegexSearch.jsx
│   │   ├── ServerStatusHub.jsx
│   │   └── VirtualizedLogHistory.jsx
│   │
│   ├── context/
│   │   └── ServerContext.jsx
│   │
│   ├── hooks/
│   │   └── useLogGenerator.js
│   │
│   ├── redux/
│   │   ├── alertSlice.js
│   │   ├── filterSlice.js
│   │   ├── logSlice.js
│   │   └── store.js
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── public/
│
├── dist/
│   ├── assets/
│   └── index.html
│
├── node_modules/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md

---

## Screenshots

### Dashboard Overview

![Dashboard Screenshot](screenshots/dashboard.png)

### Live Log Stream

![Live Log Stream](screenshots/live-log-stream.png)

### Error Frequency Tracker

![Frequency Tracker](screenshots/frequency-tracker.png)

### Server Status Hub

![Server Status Hub](screenshots/server-status-hub.png)

> Add your actual screenshots inside the `screenshots` folder and update the file names if necessary.

---

## Installation

### Prerequisites

* Node.js v18 or later
* npm v9 or later

Verify installation:

```bash

```

---

## Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/your-username/sentryflow-console.git
```

### Navigate to Project Directory

```bash
cd sentryflow-console
```

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Production Build

Create an optimized production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Usage

1. Launch the application.
2. Monitor logs through the Live Log Stream.
3. Apply filters using the Error Filter System.
4. Search logs using RegEx patterns.
5. Configure alerts through the Alert Setup Tool.
6. Analyze error trends using the Frequency Tracker.
7. View server status in the Server Status Hub.
8. Review historical logs without performance issues.

---

## Performance Optimizations

* Virtualized log rendering for large datasets.
* Efficient React component updates.
* Error boundary protection for chart failures.
* Optimized state management using Redux Toolkit.

---

## Future Enhancements

* Email and SMS notifications.
* Authentication and role management.
* Log export functionality.
* Dark mode support.
* Multi-server monitoring.
* Real-time WebSocket integration.
* AI-powered anomaly detection.

---

## Live Demo

Live Application:


---

## Repository

GitHub Repository:

https://github.com/sanjana123642/sentryflow-console.git

---

## Author

Sanjana Bashya


