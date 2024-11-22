FROM nvidia/cuda:12.6.2-base-ubuntu24.04 AS packages
# The installer requires curl (and certificates) to download the release archive
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates
# Download the latest installer
ADD https://astral.sh/uv/0.5.4/install.sh /uv-installer.sh
# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh
# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.local/bin/:$PATH"
# Copy the tiny.pt model file into the whisper cache directory inside the container
COPY tiny.pt /root/.cache/whisper/tiny.pt
WORKDIR /app
COPY pyproject.toml /app/pyproject.toml
RUN uv venv --python 3.12
RUN uv sync --no-dev --compile-bytecode

FROM packages AS app
WORKDIR /app
COPY . /app
EXPOSE 5000
CMD ["uv", "run", "python", "app.py"]