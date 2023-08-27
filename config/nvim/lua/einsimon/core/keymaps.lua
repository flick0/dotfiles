vim.g.mapleader = " "

local keymap = vim.keymap

-- general keymaps
keymap.set("i", "jk", "<ESC>")
keymap.set("n", "<leader>nh", ":nohl<CR>")
keymap.set("n", "x", '"_x')
keymap.set("n", "<leader>+", "<C-a>")
keymap.set("n", "<leader>-", "<C-x>")

-- splits
keymap.set("n", "<leader>sv", "<C-w>v")
keymap.set("n", "<leader>sh", "<C-w>s")
keymap.set("n", "<leader>se", "<C-w>=")
keymap.set("n", "<leader>sx", ":close<CR>")

-- tabs
keymap.set("n", "<leader>to", ":tabnew<CR>")
keymap.set("n", "<leader>tx", ":tabclose<CR")
keymap.set("n", "<leader>tj", ":tabn<CR>")
keymap.set("n", "<leader>tk", ":tabp<CR>")

-- file viewer
keymap.set("n", "<leader>v", ":RnvimrToggle<CR>")

-- fuzzy finder
keymap.set("n", "<leader>ff", "<cmd>lua require('fzf-lua').files()<CR>", {silent = true})
keymap.set("n", "<leader>fg", "<cmd>lua require('fzf-lua').grep()<CR>", {silent = true})
