local status, mason = pcall(require, "mason")
if not status then
    print("Could not load mason")
    return
end

local status, mason_lspconfig = pcall(require, "mason-lspconfig")
if not status then
    print("Could not load mason-lspconfig")
    return
end

mason.setup()

mason_lspconfig.setup({
    ensure_installed = {
        "clangd",
        "dockerls",
        "docker_compose_language_service",
        "grammarly",
        "jdtls",
        "kotlin_language_server",
        "texlab",
        "marksman",
        "jedi_language_server",
    }
})
