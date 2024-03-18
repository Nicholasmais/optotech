FROM python:3.11-slim-bookworm

COPY backend/ /src/

WORKDIR /src

RUN pip install -r requirements.txt

CMD ["python", "-u", "manage.py", "runserver", "0.0.0.0:8000"]
