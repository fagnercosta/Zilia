import easyocr

reader = easyocr.Reader(['pt'])
results = reader.readtext(
    image="ImagemTesteCORTADA.png"
)   


for result in results:
    print(result[1])