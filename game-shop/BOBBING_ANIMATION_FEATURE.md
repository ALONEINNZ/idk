# 🎮 Gentle Bobbing Animation Feature

## Overview
Added a subtle idle bobbing animation to the "Top 3 Games of the Week" (Featured Games) cards to make them gently catch the eye without being distracting.

## Implementation Details

### CSS Animation
- **Keyframe**: `gentleBob` with 4.5-second duration
- **Movement**: Gentle 6px upward float at the midpoint
- **Easing**: `ease-in-out` for smooth, natural motion
- **Staggered Delays**: Each card starts bobbing at different times (0s, 0.8s, 1.6s)

### JavaScript Integration
- **Target**: Only applies to `featuredGames` container
- **Activation**: Animation starts when cards become visible (intersection observer)
- **Hover Behavior**: Animation pauses on hover to avoid interference with hover effects

### Visual Characteristics
- **Subtle Movement**: Only 6px vertical displacement
- **Slow Rhythm**: 4.5-second cycle for calm, non-distracting motion
- **Staggered Start**: Creates organic, wave-like effect across the three cards
- **Hover Pause**: Maintains premium interaction feel

## Code Changes

### CSS (`styles-premium.css`)
```css
@keyframes gentleBob {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
}

.game-card.featured-bob {
    animation: gentleBob 4.5s ease-in-out infinite;
    animation-delay: var(--bob-delay, 0s);
}

.game-card.featured-bob:hover {
    animation-play-state: paused;
    transform: translateY(-10px) scale(1.02);
}
```

### JavaScript (`app-premium.js`)
- Added detection for `featuredGames` container
- Applied `featured-bob` class with staggered delays
- Integrated with existing intersection observer

## User Experience
- **Eye-Catching**: Draws attention to premium featured games
- **Non-Intrusive**: Slow, minimal movement doesn't distract from content
- **Premium Feel**: Adds sophisticated motion design element
- **Responsive**: Works seamlessly with existing hover animations

## Result
The Top 3 Games of the Week now have a gentle, breathing-like animation that makes them stand out as premium content while maintaining the overall cinematic aesthetic of the GameHub experience.