FROM mcr.microsoft.com/devcontainers/python:1-3.12-bookworm

# Remove the broken Yarn repo that ships with the base image, then install packages
RUN rm -f /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace
