local status, statusbar = pcall(require, "lualine")
if not status then
    print("Could not load statusbar")
    return
end

statusbar.setup({
    options = {
        theme = "catppuccin"
    }
})
