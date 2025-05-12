import easyocr

path = "3.png"
reader = easyocr.Reader(['en'])
results = reader.readtext(image=path,allowlist='0123456789')
for result in results:
    print(f'{result[1]} ')

print(results[0])