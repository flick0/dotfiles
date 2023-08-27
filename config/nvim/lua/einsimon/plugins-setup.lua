local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", -- latest stable release
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

local plugins = {
    -- color scheme
    {
        "catppuccin/nvim", 
        name = "catppuccin", 
        lazy = false,
        priority = 1000,
	    config = function()
            vim.cmd([[colorscheme catppuccin]])
        end,
    },

    -- enhancing vim motions
    "tpope/vim-surround",

    -- adding comments
    {
        "numToStr/Comment.nvim",
        opts = {
        },
        lazy = false
    },

    -- requirement
    "nvim-lua/plenary.nvim",

    -- file viewer
    "kevinhwang91/rnvimr",

    -- icons
    "kyazdani42/nvim-web-devicons",

    -- status bar
    'nvim-lualine/lualine.nvim',

    -- winbar
    {
        "utilyre/barbecue.nvim",
        name = "barbecue",
        version = "*",
        dependencies = {
            "SmiteshP/nvim-navic",
        },
    },

    -- fuzzy finder
    {
        "ibhagwan/fzf-lua",
        dependencies = {
            "mfussenegger/nvim-dap"
        },
        config = function()
            require("fzf-lua").setup({})
        end
    },

    -- autocompletion
    {
        "ms-jpq/coq_nvim",
        branch = "coq",
        lazy = false,
        name = "coq"
    },
    {
        "ms-jpq/coq.artifacts",
        branch = "artifacts",
    },
    {
        "ms-jpq/coq.thirdparty",
        branch = "3p",
        -- config = function()
        --     vim.cmd([[COQnow --shut-up]])
        -- end
    },

    -- lsp
    "williamboman/mason.nvim",
    "williamboman/mason-lspconfig.nvim",
    "neovim/nvim-lspconfig",

}

local opts = {}

local lazy_setup, lazy = pcall(require, "lazy")
if not lazy_setup then
	print("Lazy could not be loaded")
	return
end

lazy.setup(plugins, opts)

