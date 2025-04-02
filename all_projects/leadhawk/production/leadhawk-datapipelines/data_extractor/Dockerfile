FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && \
  apt-get install -y build-essential cmake && \
  apt-get install -y python3-dev && \
  apt-get install -y libopenblas-dev && \
  apt-get install -y liblapack-dev && \
  rm -rf /var/lib/apt/lists/*

COPY . /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["python", "extract_data_api.py"]

