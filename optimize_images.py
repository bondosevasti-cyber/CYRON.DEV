from PIL import Image
import os
import sys

# Set directory
image_dir = r"d:\ვებგვერდის მაგალითები\dev_portfolio\wweb-collection image"

# Target images
images = ["electro-pro.png", "woot-artist.png", "plant-studio.png"]
max_width = 800

def resize_image(filename):
    path = os.path.join(image_dir, filename)
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return

    try:
        with Image.open(path) as img:
            # Resize logic
            if img.width > max_width:
                print(f"Resizing {filename}...")
                aspect_ratio = img.height / img.width
                new_height = int(max_width * aspect_ratio)
                img_resized = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Overwrite original
                img_resized.save(path, optimize=True, quality=85)
                print(f"Successfully resized {filename} to {max_width}x{new_height}")
            else:
                print(f"{filename} is already small enough.")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

# Check for PIL
try:
    import PIL
except ImportError:
    print("Pillow library not found. Attempting to install...")
    os.system(f"{sys.executable} -m pip install Pillow")
    import PIL

for img_name in images:
    resize_image(img_name)
