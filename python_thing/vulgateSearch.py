# for xml parsing
import xml.dom.minidom as minidom
from xml.etree.ElementTree import parse

# for regular expressions
import re

# for gui
from tkinter import *

###########################################
# Vulgate search engine
# a python script
# by James Bernhard
# 3/30/2015
#
# Enter into "searchString" a series of
#    word beginnings separated by single
#    spaces. The engine will find verses
#    containing all of those word beginnings.
#    For full words, simply include a period
#    at the end of the word. The engine is
#    case insensitive. For word beginnings
#    that must NOT be in the search string,
#    precent then with a hyphen. 
#
# example:
#    searchString = "un et. mediat homin"
# This will cause the engine to search for
#    verses that contain a word beginning in
#    "un", one beginning in "mediat", and one
#    beginning in "homin", as well as the
#    entire word "et". (1 Timothy 2:5)
#
# example:
#    searchString = "in principi -factu verb"
# This finds verses with words beginning in
#    "in", "principi", and "verb" but not
#    containing words beginning in "factu" 
#
# uses SF_2014-09-06_LAT_VULGATE_(BIBLIA SACRA VULGATA).xml
# from http://sourceforge.net/projects/zefania-sharp/files/Bibles/LAT/
# (accessed 3/18/2015)
# This is the 2014-09-06 Biblia Sacra Vulgata with
#    Zefania XML Bible Markup Language
# named locally for this script as the file "vulgate.xml"
###########################################
###########################################


###########################################
# load the data in
###########################################
xmldoc = minidom.parse("vulgate.xml")

###########################################
# begin searchVulgate function
# input: searchString
# output: search results
###########################################
def searchVulgate(searchString):
    # start with an empty results string
    searchResults = ""

    # allow . to denote the end of the word
    searchString = searchString.replace('.',r'\b')

    # split it into separate words
    searchWords = searchString.split()

    # set up a "find this" vs "find not this" flag for each term
    findWord = []
    for i, searchWord in enumerate(searchWords):
        if (searchWord[0] == "-"):
            findWord.append(False)
            searchWords[i] = searchWord[1:]
        else:
            findWord.append(True)

    # search for text within all verses
    for verse in xmldoc.getElementsByTagName('VERS'):
        # get the verse for searching
        theVerse = verse.firstChild.nodeValue
        # flag all the words as being found until one isn't
        wordsFound = True
        # search the verse for each word in searchWords
        for i, searchWord in enumerate(searchWords):
    #        if (not(re.search(r'\b'+searchWord, theVerse, re.IGNORECASE))):
            if (bool(re.search(r'\b'+searchWord, theVerse, re.IGNORECASE)) != findWord[i]):
                # if it isn't found (at the start of a word), quit and don't print the verse
                wordsFound = False
                break

        # if we found all the words, then print the verse
        if wordsFound:
            # get the chapter and book for the verse to be printed
            chapter = verse.parentNode
            book = chapter.parentNode
            # print the verse and its chapter and book
            searchResults += '(' + book.attributes["bname"].value + ' ' + chapter.attributes["cnumber"].value + ':' + verse.attributes["vnumber"].value + ") " + verse.firstChild.nodeValue + '\n'
    if (searchResults == ""):
        searchResults = "No matches found"
    return(searchResults)

#####################################
# end of searchVulgate function
#####################################


###########################################
# gui to input the search string
###########################################
searchString = ""

# get data and close the entry window
def closeEntry():
    global searchString
    searchString = entryWidget.get()
    searchResults = searchVulgate(searchString)
    resultsWidget.delete(1.0, END)
    resultsWidget.insert(INSERT, searchResults)
    #root.destroy()   

# set up the main gui window
root = Tk()
root.title("Vulgate search engine")

# create a text entry field and put it in the root window
entryWidget = Entry(root)
entryWidget.pack(fill=X)

# when return is pressed, react
entryWidget.bind('<Return>', (lambda event: closeEntry()))

# create a scrollbar on the right
scrollbar = Scrollbar(root)
scrollbar.pack(side=RIGHT, fill=Y)

# create a button to enter search string
Button(root, text="Search", command=closeEntry).pack()

# create a space for the output
resultsWidget = Text(root, yscrollcommand=scrollbar.set)
resultsWidget.pack(side=LEFT, expand=YES, fill=BOTH)

# make sure the scrollbar updates the results y position
scrollbar.config( command = resultsWidget.yview )

# start with the focus on the text entry widget
entryWidget.focus_set()

# draw the window and await input
root.mainloop()


# example search strings
#searchString = "spelu latro"
#searchString = "in principi factu"
#searchString = "un et. mediat homin"
