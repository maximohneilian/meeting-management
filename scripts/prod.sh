python -c "import time; time.sleep(3)" # Wait for postgres to start up
python manage.py collectstatic --no-input
python manage.py migrate
gunicorn -w 4 -b 0.0.0.0:8000 project.wsgi:application
