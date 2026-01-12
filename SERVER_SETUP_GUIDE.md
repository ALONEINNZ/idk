# CS2 Style Plugin - Server Setup Guide

## 🚀 Quick Start

The CS2 Style Plugin automatically works with **ANY** Rust server map! Here's how to set it up:

## 📁 File Installation

1. **Place the plugin file:**
   ```
   /oxide/plugins/CS2Plugin.cs
   ```

2. **The plugin will automatically create these files:**
   ```
   /oxide/config/CS2Plugin.json          (Main configuration)
   /oxide/data/CS2Plugin_PlayerData.json (Player statistics)
   /oxide/data/CS2Plugin_QueueZones.json (Queue zone data)
   /oxide/data/CS2Plugin_BombSites.json  (Bomb site data)
   /oxide/data/CS2Plugin_MapConfigurations.json (Map configurations)
   ```

## ⚙️ Configuration Options

### Basic Setup (Automatic)
The plugin works **out of the box** with these default settings:

```json
{
  "Auto Generate Default Maps": true,
  "Map Generation On Server Start": true,
  "Auto Detect Map Center": true,
  "Default Map Template": "custom"
}
```

### Advanced Configuration
Edit `/oxide/config/CS2Plugin.json`:

```json
{
  "Default Team Size": 5,
  "Round Win Requirement": 13,
  "Side Swap Round": 12,
  "Buy Phase Duration": 20.0,
  "Buy Menu Duration": 40.0,
  "Bomb Timer": 40.0,
  "Max Team Damage": 300.0,
  "Max Grenade Damage": 60.0,
  
  "Auto Generate Default Maps": true,
  "Default Map Template": "custom",
  "Map Generation On Server Start": true,
  "Server Map Name": "cs2_server_map",
  "Auto Detect Map Center": true,
  "Map Generation Center": { "x": 0, "y": 0, "z": 0 },
  "Map Generation Timeout": 300.0,
  "Enable Map Validation": true
}
```

## 🗺️ How Map Generation Works

### Automatic Detection (Recommended)
1. **Plugin loads** → Detects your Rust map automatically
2. **Finds optimal location** → Scans for flat, clear areas
3. **Generates CS2 maps** → Creates competitive layouts
4. **Ready to play** → Players can join queues immediately

### Manual Setup (Optional)
If you want to specify exact locations:

```json
{
  "Auto Detect Map Center": false,
  "Map Generation Center": { "x": 100, "y": 10, "z": -50 }
}
```

## 🎮 Map Templates Available

### Standard Templates
- **`custom`** - Balanced 3-lane competitive map (Default)
- **`dust2_classic`** - Recreates Dust2 layout
- **`mirage_compact`** - Compact Mirage-style map
- **`inferno_mini`** - Mini Inferno with apartments
- **`cache_small`** - Small Cache-style industrial map

### Ultra-Detailed Templates
- **`urban_complex`** - Massive city environment
- **`industrial_facility`** - Factory complex with multiple buildings
- **`military_compound`** - Military base with realistic structures
- **`residential_district`** - Apartment buildings and houses

## 🔧 Server Commands

### Admin Commands (Require `cs2plugin.admin` permission)

#### Map Generation
```
/generatemap <template> <mapname>     - Generate a standard map
/generateultramap <template> <name>   - Generate ultra-detailed map
/confirmultramap                      - Confirm ultra map generation
/clearmap <mapname> [radius]          - Clear map area
```

#### Map Management
```
/listmaps                            - List all available maps
/validatemap <mapname>               - Check map for issues
/teleportmap <mapname>               - Teleport to a map
/exportmap <mapname>                 - Export map to file
/importmap <filename>                - Import map from file
```

#### Zone Setup
```
/setqzone <name> [teamsize]          - Create queue zone
/removeqzone <name>                  - Remove queue zone
/setbombsite <name> <mapname>        - Create bomb site
/removebombsite <name>               - Remove bomb site
/setspawn <mapname> <terrorist|ct>   - Set spawn points
/removespawn <mapname> <team> [index] - Remove spawn points
```

#### Match Control
```
/forcestart <queuezone>              - Force start match
/endmatch <matchid>                  - End active match
```

### Player Commands (Require `cs2plugin.use` permission)

#### Gameplay
```
/buymenu                             - Open/close buy menu
/joinqueue                           - Join nearest queue
/leavequeue                          - Leave current queue
/cs2stats                            - View your statistics
```

#### Spectator
```
/spec [playername]                   - Spectate player
/specnext                            - Spectate next teammate
/specprev                            - Spectate previous teammate
/freecam                             - Toggle free camera mode
```

## 🎯 Permissions

Add these permissions to your groups:

```
oxide.grant group admin cs2plugin.admin
oxide.grant group default cs2plugin.use
```

## 📊 What Happens on Server Start

1. **Plugin loads** (5 seconds after server start)
2. **Detects map center** automatically
3. **Generates main competitive map** using your chosen template
4. **Creates additional maps:**
   - `aim_training` - For aim practice
   - `retake_practice` - For retake scenarios
   - `arena_1v1` - For 1v1 duels
5. **Validates all maps** for competitive balance
6. **Ready for players!**

## 🔍 Troubleshooting

### Map Generation Issues
```
[CS2Plugin] Map generation center: (0, 0, 0)
[CS2Plugin] Available maps: 4
```
If you see this, maps generated successfully!

### No Suitable Location Found
```json
{
  "Auto Detect Map Center": false,
  "Map Generation Center": { "x": 0, "y": 50, "z": 0 }
}
```
Manually set a location if auto-detection fails.

### Performance Issues
```json
{
  "Auto Generate Default Maps": false,
  "Map Generation On Server Start": false
}
```
Disable auto-generation and create maps manually.

## 🎮 Player Experience

### Joining a Match
1. **Walk into a queue zone** → Automatically added to queue
2. **Wait for players** → Queue fills up (5v5 by default)
3. **Match starts** → Teleported to team spawn
4. **Play competitive CS2-style rounds!**

### During Matches
- **Buy Phase** → 20 seconds to buy equipment
- **Round Play** → Plant/defuse bomb or eliminate enemies
- **Spectate** → Watch teammates when dead
- **Team Swap** → Switch sides after 12 rounds
- **Match End** → First to 13 rounds wins

## 🏗️ Map Structure

Each generated map includes:
- **2 Bomb Sites** (A and B) with proper plant positions
- **Team Spawns** (5+ spawn points per team)
- **Multiple Routes** (Long, Short, Middle paths)
- **Cover Positions** (Boxes, walls, barriers)
- **Proper Lighting** (Gameplay and atmospheric)
- **Callout System** (Automatic area naming)
- **Balance Validation** (Ensures fair gameplay)

## 📈 Advanced Features

### Ultra-Detailed Maps
Generate maps with thousands of objects:
```
/generateultramap urban_complex my_city_map
/confirmultramap
```

### Map Import/Export
Share maps between servers:
```
/exportmap dust2_custom
/importmap CS2Plugin_Map_dust2_custom_20241224_120000.json
```

### Custom Templates
Modify the plugin code to add your own map templates in the `GenerateCustomMap()` function.

## 🎯 Performance Recommendations

### Small Servers (< 50 players)
```json
{
  "Default Map Template": "custom",
  "Auto Generate Default Maps": true
}
```

### Large Servers (50+ players)
```json
{
  "Default Map Template": "mirage_compact",
  "Auto Generate Default Maps": false
}
```
Generate maps manually as needed.

### Ultra Performance Servers
```json
{
  "Map Generation On Server Start": false
}
```
Generate maps during off-peak hours.

## 🔧 Maintenance

### Regular Backups
The plugin automatically backs up configurations. Manual backup:
```
/exportmap <mapname>
```

### Map Updates
Regenerate maps with new features:
```
/clearmap old_map_name 200
/generatemap custom new_map_name
```

### Performance Monitoring
Check server console for generation progress and any issues.

---

## 🎉 You're Ready!

The CS2 Style Plugin will automatically create a complete competitive environment on your Rust server. Players can join queue zones and start playing CS2-style matches immediately!

**Need help?** Check the console output for detailed information about map generation and any issues.