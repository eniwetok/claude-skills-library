# SuperBob build configuration.
#
# SuperBob is the IBM Bob extension that packages the claude-skills-library for use in
# Bob. It is a CONSUMER of the library, not the owner of it: the library's skills and
# packages are an INPUT to the build, and the extension turns them into a Bob-installable
# .vsix. SuperBob does not contain or maintain the skills themselves.
#
# This file is the single source of truth for where things live, so the extension can be
# lifted into its own git repo later with no code changes: set SB_LIBRARY to the path of a
# claude-skills-library checkout and everything else keeps working.

# Root of the SuperBob extension project (this directory).
SB_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# The claude-skills-library this extension packages. Override by exporting SB_LIBRARY.
# Default: the parent directory, because SuperBob currently lives as a subfolder of the
# library repo. After the extension moves to its own repo, point SB_LIBRARY at a library
# checkout, e.g.  export SB_LIBRARY="$HOME/Documents/Skills".
: "${SB_LIBRARY:=$(cd "$SB_ROOT/.." && pwd)}"

# Build outputs (the .vsix and the intermediate skills package) go here.
SB_DIST="$SB_ROOT/dist"

export SB_ROOT SB_LIBRARY SB_DIST
