#!/usr/bin/env python3

from pymongo import MongoClient
CLIENT = MongoClient('mongodb://projet2:projet2@ds149329.mlab.com:49329/projet2')
DB = CLIENT["projet2"]
COLL = DB.letters

DICTIONNARY = open("Letters.txt", 'r')

LETTERLIST = DICTIONNARY.readlines()

i = 0
for l in LETTERLIST:
    i = i+1
    info = l.split()
    letter = {"letter": info[0], "quantity": int(info[1]), "value": int(info[2])}
    COLL.insert_one(letter)
    print(str(i) + "/" + str(len(LETTERLIST)))
