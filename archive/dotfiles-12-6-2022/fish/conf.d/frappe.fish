# Catppuccin color palette

# --> special
set -l foreground c6d0f5
set -l selection 414559

# --> palette
set -l teal 81c8be
set -l flamingo eebebe
set -l mauve ca9ee6
set -l pink f4b8e4
set -l red e78284
set -l peach ef9f76
set -l green a6d189
set -l yellow e5c890
set -l blue 8caaee
set -l gray 737994

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
