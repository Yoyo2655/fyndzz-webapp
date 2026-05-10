import qrcode
from PIL import Image, ImageDraw

# =========================
# CONFIG
# =========================

URL = input("Lien : ").strip()

LOGO_PATH = "logo.png"   # ton logo
OUTPUT = "qr_code.png"

QR_COLOR = (0, 0, 0)
BG_COLOR = (255, 255, 255)

QR_SIZE = 1400
LOGO_SCALE = 0.22  # taille du logo

# =========================
# GENERATION QR
# =========================

qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=20,
    border=4,
)

qr.add_data(URL)
qr.make(fit=True)

img = qr.make_image(
    fill_color=QR_COLOR,
    back_color=BG_COLOR
).convert("RGBA")

img = img.resize((QR_SIZE, QR_SIZE))

# =========================
# LOGO
# =========================

logo = Image.open(LOGO_PATH).convert("RGBA")

logo_size = int(QR_SIZE * LOGO_SCALE)

logo.thumbnail((logo_size, logo_size))

# Position centrale
x = (img.size[0] - logo.size[0]) // 2
y = (img.size[1] - logo.size[1]) // 2

# =========================
# FOND BLANC ARRONDI
# =========================

padding = 40

bg_size = (
    logo.size[0] + padding,
    logo.size[1] + padding
)

white_bg = Image.new("RGBA", bg_size, (255, 255, 255, 0))

draw = ImageDraw.Draw(white_bg)

draw.rounded_rectangle(
    (0, 0, bg_size[0], bg_size[1]),
    radius=40,
    fill=(255, 255, 255, 255)
)

bg_x = x - padding // 2
bg_y = y - padding // 2

img.paste(white_bg, (bg_x, bg_y), white_bg)

# =========================
# AJOUT LOGO
# =========================

img.paste(logo, (x, y), logo)

# =========================
# SAVE
# =========================

img.save(OUTPUT)

print(f"QR généré : {OUTPUT}")