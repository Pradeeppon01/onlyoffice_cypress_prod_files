#!/bin/bash

num_terminals=5

for ((i=1; i<=$num_terminals; i++))
do
    screen -dmS "terminal$i"
    screen -S "terminal$i" -X stuff $'cd /home/neuu/Downloads/test10-20230715T055831Z-001/test10\n'
    screen -S "terminal$i" -X stuff $'npm run cypress:execution\n'
done
