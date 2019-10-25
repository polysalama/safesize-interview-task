#!/usr/bin/env bash

url=""
param=""
value=""
lang=""
op=""
help="Usage:\n \
    manage-yaml.sh <url:port> getParams\n \
    manage-yaml.sh <url:port> getParam <paramId>\n \
    manage-yaml.sh <url:port> getValue <paramId> <valueId>\n \
    manage-yaml.sh <url:port> addParam <paramId>\n \
    manage-yaml.sh <url:port> addValue <paramId> <valueId>\n \
    manage-yaml.sh <url:port> addParamTrans <paramId> <langId> <JSON>\n \
    manage-yaml.sh <url:port> addParamTrans <paramId> <valueIid> <langId> <JSON>\n
    manage-yaml.sh <url:port> removeParam <paramId>\n \
    manage-yaml.sh <url:port> removeValue <paramId> <valueId>\n \
    manage-yaml.sh <url:port> removeParamTrans <paramId> <langId>\n \
    manage-yaml.sh <url:port> removeParamTrans <paramId> <valueIid> <langId>"

if [ $# -eq 0 ]
then 
    echo -e $help
    exit 
fi




case "$2" in
        "getParams")      
            result=$(curl -s -X GET "$1") 
            ;;
        "getParam")      
            result=$(curl -s -H -X GET "$1/$3")
            ;;
        "getValue")
            result=$(curl -s -v -X GET "$1/$3?value=$4") 
            ;; 
        "addParam")
            result=$(curl -s -v -X POST "$1/$3") 
            ;;
        "addValue")
            result=$(curl -s -v -X POST "$1/$3?value=$4")
            ;;
        "addParamTrans")
            result=$(curl -s -v -X PUT "$1/$3?lang=$4" -H "Content-Type: application/json" -d "$5") 
            ;;
        "addValueTrans")
            result=$(curl -s -v -X PUT "$1/$3?value=$4&lang=$5" -H "Content-Type: application/json" -d "$6") 
            ;;
        "removeParam")
            result=$(curl -s -v -X DELETE "$1/$3")
            ;;
        "removeValue")
            result=$(curl -s -v -X DELETE "$1/$3?value=$4") 
            ;;
        "removeParamTrans")
            result=$(curl -s -v -X DELETE "$1/$3?lang=$4") 
            ;;
        "removeValueTrans")
            result=$(curl -s -v -X DELETE "$1/$3?value=$4&lang=$5") 
            ;;
        *)
            echo -e 'Wrong command.\n'
            result=$help
            ;;
esac

echo -e $result