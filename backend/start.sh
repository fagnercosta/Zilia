printenv | sed 's/^\(.*\)$/export \1/g' > env.sh
sed -i '/SAP_/d' env.sh

# Django: migrate
#
# Django will apply all necessary migrations.
python3 ${APP_PATH}/manage.py migrate

#####
# Start gunicorn
#####
echo "==> Starting gunicorn..."
/usr/local/bin/gunicorn --access-logfile - -w 4 core.wsgi:application -b 0.0.0.0:80 &
# Get the gunicorn process PID
child=$!
# Wait for gunicorn - receiving a SIGTERM/SIGINT can make 'wait' return immediately despite gunicorn maybe still shutting down
wait "$child"
# Removing the trap to avoid propagating it twice in the unlikely case another signal is received in the mean time
trap - SIGINT SIGTERM
# Wait for gunicorn's exit code
wait "$child"
# Bubble up gunicorn's exit code
EXIT_STATUS=$?
