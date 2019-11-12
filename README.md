## Game of Life

![gameoflifenice](https://user-images.githubusercontent.com/1412442/68679396-753ea980-0568-11ea-80fe-657e0e284dd7.PNG)

## This project is an example of using rust / wasm and nodejs

This is the code I got after following the tutorial:
https://rustwasm.github.io/book/game-of-life/introduction.html

## Steps to run:

```bash
# Install rust
curl https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env

# Install wasm for rust
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
source $HOME/.cargo/env

# Install cargo-generate
cargo install cargo-generate

# Install Nodejs 12.13.0
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh -o install_nvm.sh
bash install_nvm.sh
source ~/.profile
nvm install 12.13.0
nvm install 12.13.0

# Build  rust code and wasm bindings
wasm-pack build

# Run nodejs development server on http://0.0.0.0:8080
cd www && npm run start
```

## Result
Navigate in the browser to `http://<ip>:8080`.
