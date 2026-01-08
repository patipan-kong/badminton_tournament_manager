# Badminton Tournament Manager
🍣 Badminton Tournament Manager - Web App for Referee or Organizer

## 🌟 Features

### Tournament Management
- **Basic Infomation**: Name of tournament, Period(Start,End), Mode (MS,WS,MD,WD,XD), No of Participant of each Type
- **Player Registration**: User can add only player name and register in Tournament
- **Draw mode**: Automatic draw (from first round to final round)
- **Automatic Tournament Bracket & Match Schedule **: After match finished, automatic show Tournament Bracket

### Scoring Interface
- **Score Management**: User can click to add score for each player
- **Score Display**: Show score of each set using badminton rules (21pt of each set and winner must win 2of3 sets)

### User Experience
- **Touch-friendly interface**: Click plus button to add, tap minus button to reduce
- **Smart navigation**: Can easily back to other match list
- **Mobile-first design**: Optimized for thumb-friendly interactions

### Technical Features
- **Data Storage**: Using JSON file
- **Responsive design**: Mobile-optimized with prevent zoom on double-tap
- **Session management**: Optional localStorage for data persistence
- **Error handling**: Graceful fallbacks and user-friendly error messages

---

## 🌟 Technology Stack

### Frontend
- **HTML5**: Semantic structure with accessibility features
- **CSS3 + TailwindCSS**: Utility-first styling with custom animations
- **JavaScript (ES6+)**: Modern vanilla JavaScript with async/await
- **Responsive Design**: Mobile-first approach with touch optimization

### Data Management
- **JSON Configuration**: Tournament and Player configurations
- **Dynamic Loading**: Automatic detection of tournament config files
- **LocalStorage**: Optional session persistence
- **Client-side State**: Real-time data management without backend

### Architecture
- **Cross-platform**: Compatible with all modern browsers

---

## 🌟 User Journey

### 1. Tournament Selection or New Tournament
- **Auto-load Tournament**: System automatically detects available Tournament from JSON file
- **Tournament selection**: Choose from Tournament name 
- **Create new tournament**: create new tournament with basic information

### 2. Tournament mode Selection
- **Auto-load All mode Provide on Tournament**: System automatically detects available Tournament Mode
- **Screen to show**: 
If not starting, user can manage player , 
If not drawing, user can press auto drawing button for auto draw
then show Tournament Bracket of each mode, user can click on each match to enter score and result

### 3. Player Management
- **Easy management**: 
  - Click "Add Player" to add more participants
  - Edit names directly in full-width input fields
  - Remove participants with confirmation dialog

### 4. Scoring & Winning
- **Rule**: using basic badmiton rule
- **Real-time updates**: Live totals update instantly
- **Visual guidance**: Clear instructions in English language

### 5. Actions & Navigation
- **Easy navigation**: 
  - "Back to Previous" returns to Previous Screen (From Match Scoring Page to Tournament mode, From Tournament mode to Mode select, Mode select to tournament list)
- **Reset option**: Clear all data and restart