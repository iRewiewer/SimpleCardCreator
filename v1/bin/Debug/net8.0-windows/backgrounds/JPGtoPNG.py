from PIL import Image
from os import listdir, mkdir


def Convert(images):
    for image in images:
        im = Image.open(image)
        newimage = f"./pngs/{image.split('.')[0]}.png"
        im.save(newimage)
        print(f"Saved '{image}' to '{newimage}'")


mkdir("./pngs")
Convert([image for image in listdir('.') if ".jpg" in image])
Convert([image for image in listdir('.') if ".jpeg" in image])
Convert([image for image in listdir('.') if ".webp" in image])
