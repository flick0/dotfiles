local beautiful = require("beautiful")

function get_xrdb_resources()
    local xrdb = beautiful.xresources.get_current_theme()
    return {
        background = xrdb.background,
        foreground = xrdb.foreground,
        color0     = xrdb.color0,
        color1     = xrdb.color1,
        color2     = xrdb.color2,
        color3     = xrdb.color3,
        color4     = xrdb.color4,
        color5     = xrdb.color5,
        color6     = xrdb.color6,
        color7     = xrdb.color7,
        color8     = xrdb.color8,
        color9     = xrdb.color9,
        color10    = xrdb.color10,
        color11    = xrdb.color11,
        color12    = xrdb.color12,
        color13    = xrdb.color13,
        color14    = xrdb.color14,
        color15    = xrdb.color15,
    }
end

return get_xrdb_resources()
