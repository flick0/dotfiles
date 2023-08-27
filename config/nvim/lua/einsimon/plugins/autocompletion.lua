local status, lsp = pcall(require, "lspconfig")
if not status then
    print("Could not load lspconfig")
    return
end

vim.g.coq_settings = {
    auto_start = "shut-up"
}

local status, autocompletion = pcall(require, "coq")
if not status then
    print("Could not load autocompletion plugin")
    return
end

vim.cmd('COQnow --shut-up')

require("coq_3p") {
    {
        src = "vimtex",
        short_name = "vTEX"
    },
    {
        src = "builtin/c"
    },
}

lsp.clangd.setup(coq.lsp_ensure_capabilities())
lsp.dockerls.setup(coq.lsp_ensure_capabilities())
lsp.docker_compose_language_service.setup(coq.lsp_ensure_capabilities())
lsp.grammarly.setup(coq.lsp_ensure_capabilities())
lsp.jdtls.setup(coq.lsp_ensure_capabilities())
lsp.kotlin_language_server.setup(coq.lsp_ensure_capabilities())
lsp.texlab.setup(coq.lsp_ensure_capabilities())
lsp.marksman.setup(coq.lsp_ensure_capabilities())
lsp.jedi_language_server.setup(coq.lsp_ensure_capabilities())

