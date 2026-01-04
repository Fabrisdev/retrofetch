# Retrofetch
Retrofetch is an alternative to neofetch built on Bun. It supports displaying images and is currently in development.

## Precautions
Retrofetch only works on Bun and is a crucial neccessity for bundling. Node.js is not supported. The only supported platform is Linux.

## Installation
1. Install the dependencies
```bash
bun install
```
2. Create the executable
```bash
bun run build
```
3. Copy it to your ~/.local/bin
```bash
mv retrofetch ~/.local/bin
```
Check now if you can run it with `retrofetch`. If it can't find the command continue with step 4.

4. Add it to your PATH
```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' > ~/.bashrc
```

## Possible dependencies
These are some dependencies you *may* need to install on your system for retrofetch to work properly. However, most likely you already have them installed. Only check this section if retrofetch is crashing.
- wayland-info