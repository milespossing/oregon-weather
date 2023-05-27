FROM rust:1.57 as builder
LABEL authors="miles"

WORKDIR /usr/src

COPY . .

RUN cargo build --release

FROM debian:buster-slim

# Install openssl, cron, and ca-certificates
RUN apt-get update && apt-get install -y libssl-dev cron ca-certificates

WORKDIR /usr/src

COPY --from=builder /usr/src/target/release/oregon-weather .

ENV PATH=/usr/src:$PATH
# Add crontab file in the cron directory
ADD crontab /etc/cron.d/cron-job
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/cron-job
# Apply cron job
RUN crontab /etc/cron.d/cron-job
# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Run the command on container startup
CMD cron && tail -f /var/log/cron.log
