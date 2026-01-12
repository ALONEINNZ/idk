// CS2 Plugin - FIXED VERSION
// This file contains all the bug fixes and missing implementations

using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using Oxide.Core;
using Oxide.Core.Plugins;
using Oxide.Game.Rust.Cui;
using Newtonsoft.Json;
using System.Collections;

namespace Oxide.Plugins
{
    [Info("CS2 Style Plugin", "YourName", "1.0.1")]
    [Description("CS2-style competitive gameplay plugin for Rust - FIXED VERSION")]
    public class CS2Plugin : RustPlugin
    {
        #region Fields and Configuration
        
        private Configuration config;
        private Dictionary