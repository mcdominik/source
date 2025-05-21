from PIL import Image


def image_to_c_array(image_path, output_path="oled_image.h", width=128, height=64):
    img = Image.open(image_path).convert("1").resize((width, height))
    pixels = list(img.getdata())

    with open(output_path, "w") as f:
        f.write("const uint8_t oled_image[] = {\n")
        for y in range(height):
            for x in range(0, width, 8):
                byte = 0
                for bit in range(8):
                    if x + bit < width:
                        pixel = pixels[y * width + x + bit]
                        byte |= (pixel == 0) << (7 - bit)
                f.write(f"0x{byte:02X},")
            f.write("\n")
        f.write("};\n")


def view_c_array(header_path, width=128, height=64):
    with open(header_path, "r") as f:
        lines = f.readlines()

    data = []
    for line in lines:
        if "0x" in line:
            hex_values = [int(val, 16) for val in line.strip().split(",") if val.startswith("0x")]
            data.extend(hex_values)

    img = Image.new("1", (width, height))
    pixels = img.load()

    i = 0
    for y in range(height):
        for x in range(0, width, 8):
            byte = data[i]
            for bit in range(8):
                if x + bit < width:
                    pixels[x + bit, y] = 0 if (byte & (1 << (7 - bit))) else 255
            i += 1

    img.show()


# image_to_c_array("yt.png")
view_c_array("oled_image.h")
