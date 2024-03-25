FROM python:3.11-slim-bookworm

COPY ./backend/ /src/

WORKDIR /src

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip install -r requirements.txt

CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python -u manage.py runserver 0.0.0.0:8000"]
