local status, winbar = pcall(require, "barbecue")
if not status then
    print("Could not load winbar")
    return
end

-- triggers CursorHold event faster
vim.opt.updatetime = 200

winbar.setup({
    theme = "catppuccin",
    create_autocmd = false, -- prevent barbecue from updating itself automatically
})

vim.api.nvim_create_autocmd({
  "WinScrolled", -- or WinResized on NVIM-v0.9 and higher
  "BufWinEnter",
  "CursorHold",
  "InsertLeave",
}, {
  group = vim.api.nvim_create_augroup("barbecue.updater", {}),
  callback = function()
    require("barbecue.ui").update()
  end,
})
