#!/usr/bin/env python3

from pymongo import MongoClient
CLIENT = MongoClient('mongodb://projet2:projet2@ds149329.mlab.com:49329/projet2')
DB = CLIENT["projet2"]
COLL = DB.words

DICTIONNARY = open("Dictionary.txt", 'r')

WORDLIST = DICTIONNARY.readlines()

i = 0
for w in WORDLIST:
    i = i+1
    word = {"word": w.rstrip('\n')}
    COLL.insert_one(word)
    print(str(i) + "/" + str(len(WORDLIST)))
