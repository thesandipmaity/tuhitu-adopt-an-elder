import qrcode
import os

# URLs for the two forms based on your website's routing
urls = {
    "Sponsor_Form_QR": "https://tuhitucare.com/sponsor/#sponsor-enquiry",
    "Elder_Registration_QR": "https://tuhitucare.com/?action=elder-registration"
}

print("Generating QR codes...")

for name, url in urls.items():
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    filename = f"{name}.png"
    img.save(filename)
    print(f"Generated {filename} -> {url}")

print("\nDone! You can find the images in the project folder.")
