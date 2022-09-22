# Catppuccin color palette

# --> special
set -l foreground 4c4f69
set -l selection ccd0da

# --> palette
set -l teal 179299
set -l flamingo dd7878
set -l mauve 8839ef
set -l pink ea76cb
set -l red d20f39
set -l peach fe640b
set -l green 40a02b
set -l yellow df8e1d
set -l blue 1e66f5
set -l gray 9ca0b0

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
