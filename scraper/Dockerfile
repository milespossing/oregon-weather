FROM rust:1.57 as builder
LABEL authors="miles"

WORKDIR /usr/src

COPY . .

RUN cargo build --release

FROM debian:buster-slim

# Install openssl
RUN apt-get update && apt-get install -y libssl-dev

WORKDIR /usr/src

COPY --from=builder /usr/src/target/release/oregon-weather .

CMD ["./oregon-weather"]
