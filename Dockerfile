FROM continuumio/miniconda3

RUN mkdir -p /backend
RUN mkdir -p /scripts
RUN mkdir -p /static-files
RUN mkdir -p /media-files
RUN mkdir -p /frontend

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install curl -y
RUN curl https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

COPY ./backend/requirements.yml /backend/requirements.yml
COPY ./scripts /scripts
RUN chmod +x /scripts/ #gives the right to access each file in the folder : x=execute

RUN opt/conda/bin/conda env create -f /backend/requirements.yml
#DO NOT DELETE!!! - don't create pycache

ENV PYTHONDONTWRITEBYTECODE=1
#looks for the path for the conda environment
ENV PATH /opt/conda/envs/cannabees_backend/bin/:$PATH
#activate the backend environment
RUN echo 'source activate cannabees_backend'>~/.bashrc

WORKDIR /frontend
COPY ./frontend/package.json /frontend/
COPY ./frontend/package-lock.json /frontend/
RUN npm install
COPY ./frontend /frontend
RUN npm run build

COPY ./backend /backend
# changing root to working folder
WORKDIR /backend