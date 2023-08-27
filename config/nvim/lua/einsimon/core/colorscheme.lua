local status, colorscheme = pcall(require, "catppuccin")
if not status then
    print("Could not load colorscheme")
    return
end

colorscheme.setup({
    dashboard = true
})
