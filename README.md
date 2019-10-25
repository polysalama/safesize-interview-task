# Safesize job interview 

Small app to edit yaml file via REST api or bash script written in Node.js with Express.

### How to run app

Port is set to 8080 by default.

##### If using docker-compose

`docker-compose up --build -d`

##### If using npm
```
cd app 
npm install --save 
npm start 
```

### Bash script
```
manage-yaml.sh <url:port> getParams
manage-yaml.sh <url:port> getParam <paramId>
manage-yaml.sh <url:port> getValue <paramId> <valueId>
manage-yaml.sh <url:port> addParam <paramId>
manage-yaml.sh <url:port> addValue <paramId> <valueId>
manage-yaml.sh <url:port> addParamTrans <paramId> <langId> <JSON>
manage-yaml.sh <url:port> addValueTrans <paramId> <valueIid> <langId> <JSON>
manage-yaml.sh <url:port> removeParam <paramId>
manage-yaml.sh <url:port> removeValue <paramId> <valueId>
manage-yaml.sh <url:port> removeParamTrans <paramId> <langId>
manage-yaml.sh <url:port> removeValueTrans <paramId> <valueIid> <langId>
```

##### JSON Schema for addParamTrans and addValueTrans
```JSON
{
    "short:" "<String>",
    "long:" "<String>"  
}    
```
