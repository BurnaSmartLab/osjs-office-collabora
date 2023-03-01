# OSjs Office Application

![hafez_office](https://user-images.githubusercontent.com/70196035/124575730-e418f680-de60-11eb-9cef-77ee5e274a03.png)

## Introduction

This is an application for OSjs which can open and make document, presentation and spreadsheet files, supporting a wide range of extensions, using [Collabora Online Development Edition (CODE)](https://www.collaboraoffice.com/code/) service. <br/>

## Package Installation by Cloning

1- Navigate to the following directory of OS.js project

```bash
cd src/packages
```

2- Clone hosting application in this directory

```bash
git clone https://github.com/BurnaSmartLab/osjs-office-collabora.git
```

3- Then navigate to cloned directory

```bash
cd osjs-office-collabora
```

4- Run following command in the current directory to install dependencies

```bash
npm install
```

5-Build office package in current directory

```bash
npm run build
```

6- Run following command in root directory of OSjs project

```bash
npm run package:discover
```

7- Run serve command in root directory of OSjs project

```bash
npm run serve

```

## Package Installation by by NPM Dependency Manager:

1- Execute the following command in OS.js root directory

```bash
npm install @burna/osjs-office-collabora
```

2- Run following command in root directory of OSjs project

```bash
npm run package:discover
```

## Usage:

Add following `office` and `express` config to `src/server/config.js` file of OSjs:

```js
// Replace 'http://localhost:12345' with your valid Collabora server address
    express:{
      maxBodySize:'1000000kb'
    },
    office: {
      collabora_online: 'http://localhost:12345'
    },
```

The office application is available in Office Menu of the OS.js :tada:

## Quick development with docker-compose

Run the following command to run `Collabora`, `OSJS` and `osjs-office-collabora` together:

```bash
docker compose up -d
```

Be advised to change the `collabora_online_URL` and `osjs_URL` environments inside `docker-compose.yml` based on your local IP address.

After that the containers are up and running, you can access `OSJS` using your local IP address and the port specified (default 8000) like below:

```
http://<ip>:8000
```

Be advised to change `<ip>` with your own local IP address. In addition, every change to the `osjs-office-collabora` results in webpack build and server restart which makes it a very good choice for developing package inside the `OSJS` environment.

## Quick installation of CODE docker

1- Grab the Docker image

```bash
docker pull collabora/code
```

2- Start a new container, for example:

```bash
docker run -t -d -p 9980:9980 -e "extra_params=--o:ssl.enable=false" --privileged  --volume "/usr/share/fonts/truetype/:/opt/collaboraoffice6.4/share/fonts/truetype/local/:ro" -e "username=admin" -e "password=admin" --name collabora --cap-add MKNOD collabora/code
```

Here is the [step-by-step instructions](https://sdk.collaboraonline.com/docs/installation/CODE_Docker_image.html)
