#!/bin/sh

# Function to handle termination signals
terminate_process() {
    echo "Terminating Node.js process..."
    pkill -TERM node
}

# Trap termination signals
trap terminate_process TERM INT

if [ -z "${LIVEKIT_URL}" ]; then
    echo "LIVEKIT_URL is required"
    echo "example: docker run -e LIVEKIT_URL=https://livekit-server:7880 -e LIVEKIT_API_KEY=api_key -e LIVEKIT_API_SECRET=api_secret -p 6080:6080 openvidu-call"
    exit 1
fi
if [ -z "${LIVEKIT_API_KEY}" ]; then
    echo "LIVEKIT_API_KEY is required"
    echo "example: docker run -e LIVEKIT_URL=https://livekit-server:7880 -e LIVEKIT_API_KEY=api_key -e LIVEKIT_API_SECRET=api_secret -p 6080:6080 openvidu-call"
    exit 1
fi
if [ -z "${LIVEKIT_API_SECRET}" ]; then
    echo "LIVEKIT_API_SECRET is required"
    echo "example: docker run -e LIVEKIT_URL=https://livekit-server:7880 -e LIVEKIT_API_KEY=api_key -e LIVEKIT_API_SECRET=api_secret -p 6080:6080 openvidu-call"
    exit 1
fi

cd /opt/openvidu-call
node dist/server.js &

# Save the PID of the Node.js process
node_pid=$!

# Wait for the Node.js process to finish
wait $node_pid
