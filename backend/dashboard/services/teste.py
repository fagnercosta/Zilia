class ImageChooserBlock():
    pass

class StructBlock():
    pass

class URLBlock():
    pass

class BannerBlock(StructBlock):  
    image = ImageChooserBlock(
        required=True,
        label="Banner Image",
        help_text="Upload banner image"
    )
    link = URLBlock(
        required=False,
        label="Banner Link",
        help_text="URL for banner redirection"
    )    
    class Meta:
        icon = 'image'
        label = "Wide Banner"
        template = "blocks/banner_block.html"

 