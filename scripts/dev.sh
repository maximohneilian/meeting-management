python -c "import time; time.sleep(3)" # Wait for postgres to start up
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0:8000
