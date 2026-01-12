using System;
using Oxide.Core;
using Oxide.Core.Plugins;

namespace Oxide.Plugins
{
    [Info("CS2 Style Plugin", "Test", "1.0.0")]
    [Description("Minimal test version to verify compilation")]
    public class CS2Plugin : RustPlugin
    {
        void Init()
        {
            PrintWarning("CS2 Plugin loaded successfully!");
        }
        
        [ChatCommand("test")]
        private void TestCommand(BasePlayer player, string command, string[] args)
        {
            SendReply(player, "CS2 Plugin is working!");
        }
    }
}