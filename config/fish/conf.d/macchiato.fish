# Catppuccin color palette

# --> special
set -l foreground cad3f5
set -l selection 363a4f

# --> palette
set -l teal 8bd5ca
set -l flamingo f0c6c6
set -l mauve c6a0f6
set -l pink f5bde6
set -l red ed8796
set -l peach f5a97f
set -l green a6da95
set -l yellow eed49f
set -l blue 8aadf4
set -l gray 6e738d

# Syntax Highlighting
set -g fish_color_normal $foreground
set -g fish_color_command $blue
set -g fish_color_param $flamingo
set -g fish_color_keyword $red
set -g fish_color_quote $green
set -g fish_color_redirection $pink
set -g fish_color_end $peach
set -g fish_color_error $red
set -g fish_color_gray $gray
set -g fish_color_selection --background=$selection
set -g fish_color_search_match --background=$selection
set -g fish_color_operator $pink
set -g fish_color_escape $flamingo
set -g fish_color_autosuggestion $gray
set -g fish_color_cancel $red

# Prompt
set -g fish_color_cwd $yellow
set -g fish_color_user $teal
set -g fish_color_host $blue

# Completion Pager
set -g fish_pager_color_progress $gray
set -g fish_pager_color_prefix $pink
set -g fish_pager_color_completion $foreground
set -g fish_pager_color_description $gray
