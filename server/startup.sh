# script for supervisord, we need it because supervisor is really shitty
echo starting via babel-node

trap "{ echo Stopping babel-node; ps -ef | grep da-board | grep node | awk '{print $2}' | xargs kill -9; exit 0; }" TERM

babel-node server.js &

PID=$!
wait $PID
