"""Khung carbon 1 tấm cho mini drone ESP-Drone + motor 8520 (cánh 55 mm).

Usage: python make_frame.py   → frame-120.dxf (gửi xưởng CNC), frame-120.svg (xem trước, có vòng cánh tham chiếu)
Đơn vị mm. Trục X chỉ về mũi máy, Y sang trái (giống quy ước MPU6050 trong hướng dẫn).
"""
import math
import os

import ezdxf
from shapely import affinity
from shapely.geometry import LineString, Point, box
from shapely.ops import unary_union

HERE = os.path.dirname(os.path.abspath(__file__))

# ---- thông số ----
WHEELBASE = 120.0          # khoảng cách chéo tâm motor M1–M3
PROP_D = 55.0              # cánh 55 mm
T = 1.5                    # độ dày tấm carbon
MOTOR_HOLE = 8.6           # motor 8,5 mm quấn 1 lớp gen co nhiệt rồi ép vào
POD_OD = 14.0              # vành ôm motor
ARM_W = 7.0
BODY = (-47.0, -18.0, 38.0, 18.0)    # thân: dài 85, rộng 36 (đuôi dài để rãnh dây thun nằm trước + sau pin)
NOSE = (36.0, -13.0, 54.0, 13.0)     # lưỡi mũi gắn XIAO + camera
FILLET = 3.0
SEG = 0.2                  # sai số xấp xỉ cung (mm)

m = WHEELBASE / 2 / math.sqrt(2)
MOTORS = {'M1': (m, -m), 'M2': (-m, -m), 'M3': (-m, m), 'M4': (m, m)}   # M1 trước phải, M2 sau phải, M3 sau trái, M4 trước trái (Y+ = trái)

res = 64


def rbox(x0, y0, x1, y1, r):
    return box(x0 + r, y0 + r, x1 - r, y1 - r).buffer(r, resolution=res)


def slot(cx, cy, length, width, angle=0.0):
    """Rãnh bo tròn 2 đầu (hợp với dao phay tròn). length theo phương angle."""
    h = (length - width) / 2
    ln = LineString([(-h, 0), (h, 0)]).buffer(width / 2, resolution=res)
    return affinity.translate(affinity.rotate(ln, angle, origin=(0, 0)), cx, cy)


# ---- khối ngoài ----
solid = [rbox(*BODY, 5), rbox(*NOSE, 4)]
for x, y in MOTORS.values():
    solid.append(LineString([(0, 0), (x, y)]).buffer(ARM_W / 2, resolution=res))
    solid.append(Point(x, y).buffer(POD_OD / 2, resolution=res))
outer = unary_union(solid)
outer = outer.buffer(FILLET, resolution=res).buffer(-FILLET, resolution=res)   # bo góc trong chỗ tay nối thân

# ---- lỗ khoét ----
holes = [Point(x, y).buffer(MOTOR_HOLE / 2, resolution=res) for x, y in MOTORS.values()]
# dây rút giữ ESP32 DevKit (51 x 28 mm, đặt x = -14..37): 2 cặp rãnh ngang thân
for x in (-8.0, 28.0):
    for y in (-15.5, 15.5):
        holes.append(slot(x, y, 3.4, 1.6, 0))
# dây thun giữ pin nằm ngang dưới bụng, phía sau: pin (dày ~19 mm theo X) nằm giữa 2 rãnh x = -40..-21
for x in (-43.5, -17.5):
    holes.append(slot(x, 0, 13.0, 2.6, 90))
# dây rút giữ XIAO ở mũi
for y in (-10.8, 10.8):
    holes.append(slot(46.0, y, 3.4, 1.6, 0))
# cửa khoét giảm cân (kiêm lỗ luồn dây xuống cảm biến mặt dưới): chừa viền và gân >= 2,7 mm quanh mọi rãnh
LIGHTEN = [(-39.0, -11.5, -22.0, 11.5),   # dưới pin (pin tựa lên 2 viền, dây thun giữ)
           (-13.0, -11.5, 3.0, 11.5),     # dưới DevKit
           (7.0, -11.5, 21.5, 11.5),
           (25.5, -11.5, 33.5, 11.5),
           (40.0, -6.5, 50.0, 6.5)]       # mũi, dưới XIAO
for w in LIGHTEN:
    holes.append(rbox(*w, 3.0))
# lỗ luồn dây motor dọc tay (gần thân)
for x, y in MOTORS.values():
    k = 0.52
    holes.append(Point(x * k, y * k).buffer(1.6, resolution=res))

frame = outer.difference(unary_union(holes))

# ---- 4 vòng đệm dán dưới vành motor (tăng chiều cao ôm lên 3 mm) ----
rings = []
for i in range(4):
    cx, cy = 72.0 + i * 17.0, -62.0
    rings.append(Point(cx, cy).buffer(POD_OD / 2, resolution=res).difference(Point(cx, cy).buffer(MOTOR_HOLE / 2, resolution=res)))

parts = [frame] + rings


# ---- xuất DXF ----
def rings_of(poly):
    yield poly.exterior
    yield from poly.interiors


doc = ezdxf.new('R2010', setup=True)
doc.units = ezdxf.units.MM
doc.header['$INSUNITS'] = 4
msp = doc.modelspace()
doc.layers.add('CUT', color=7)
for p in parts:
    for ring in rings_of(p.simplify(0.01)):
        msp.add_lwpolyline(list(ring.coords), close=True, dxfattribs={'layer': 'CUT'})
dxf_path = os.path.join(HERE, 'frame-120.dxf')
doc.saveas(dxf_path)

# ---- xuất SVG xem trước ----
minx, miny, maxx, maxy = unary_union(parts).bounds
pad = 32
W, H = maxx - minx + 2 * pad, maxy - miny + 2 * pad
S = 6  # px/mm


def tx(x, y):
    return ((x - minx + pad) * S, (maxy - y + pad) * S)   # lật Y: mũi (X+) sang phải, trái (Y+) lên trên


def path_d(poly):
    d = ''
    for ring in rings_of(poly):
        pts = [tx(*c) for c in ring.coords]
        d += 'M' + 'L'.join(f'{a:.1f},{b:.1f}' for a, b in pts) + 'Z'
    return d


svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W * S:.0f}" height="{H * S:.0f}" viewBox="0 0 {W * S:.0f} {H * S:.0f}" font-family="Segoe UI,Arial">',
       f'<rect width="100%" height="100%" fill="#fbfaf6"/>']
for x, y in MOTORS.values():   # vòng cánh quạt (chỉ tham chiếu)
    cx, cy = tx(x, y)
    svg.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{PROP_D / 2 * S:.1f}" fill="#4aa3df" fill-opacity=".08" stroke="#4aa3df" stroke-dasharray="8 6" stroke-width="2"/>')
for p in parts:
    svg.append(f'<path d="{path_d(p)}" fill="#2b2f33" fill-rule="evenodd" stroke="#000" stroke-width="1.5"/>')


def ghost(x0, y0, x1, y1, label, color):
    a, b = tx(x0, y1)
    c, d = tx(x1, y0)
    svg.append(f'<rect x="{a:.1f}" y="{b:.1f}" width="{c - a:.1f}" height="{d - b:.1f}" rx="6" fill="{color}" fill-opacity=".25" stroke="{color}" stroke-width="2" stroke-dasharray="6 4"/>')
    svg.append(f'<text x="{(a + c) / 2:.1f}" y="{(b + d) / 2 + 7:.1f}" font-size="20" font-weight="700" text-anchor="middle" fill="{color}">{label}</text>')


ghost(-14, -14.2, 37, 14.2, 'ESP32 DevKit (trên)', '#e0a100')
ghost(38.5, -8.75, 59.5, 8.75, 'XIAO', '#2e9e5b')
ghost(-40, -30, -21, 30, '', '#d9534f')
a, b = tx(-30.5, 31)
svg.append(f'<text x="{a:.1f}" y="{b - 8:.1f}" font-size="18" font-weight="700" text-anchor="middle" fill="#d9534f">Pin (dưới)</text>')
for name, (x, y) in MOTORS.items():
    cx, cy = tx(x, y)
    rot = '↺' if name in ('M1', 'M3') else '↻'
    svg.append(f'<text x="{cx:.1f}" y="{cy + (-100 if y > 0 else 118):.1f}" font-size="24" font-weight="800" text-anchor="middle" fill="#1d4e89">{name} {rot}</text>')
a, b = tx(maxx + 4, 0)
svg.append(f'<text x="{a:.1f}" y="{b + 8:.1f}" font-size="22" font-weight="800" fill="#c0392b">MŨI ▶</text>')
# thước đo
a, b = tx(*MOTORS['M2'])
c, d = tx(*MOTORS['M4'])
svg.append(f'<line x1="{a:.1f}" y1="{b:.1f}" x2="{c:.1f}" y2="{d:.1f}" stroke="#c0392b" stroke-width="1.5" stroke-dasharray="4 4"/>')
e, f = tx(8, 34)
svg.append(f'<text x="{e:.1f}" y="{f:.1f}" font-size="18" text-anchor="end" fill="#c0392b">chéo {WHEELBASE:.0f} mm ↗</text>')
area = sum(p.area for p in parts)
mass = area * T / 1000 * 1.55
svg.append(f'<text x="{16}" y="{H * S - 18:.0f}" font-size="18" fill="#333">Carbon 3K {T} mm · thân {BODY[2] - BODY[0]:.0f}×{BODY[3] - BODY[1]:.0f} mm · lỗ motor Ø{MOTOR_HOLE} · ước tính {mass:.1f} g (cả 4 vòng đệm) · vòng xanh = cánh {PROP_D:.0f} mm</text>')
svg.append('</svg>')
open(os.path.join(HERE, 'frame-120.svg'), 'w', encoding='utf-8').write('\n'.join(svg))

# ---- kiểm tra ----
ext = unary_union(parts).bounds
print(f'DXF: {dxf_path}')
print(f'kích thước bao: {ext[2] - ext[0]:.1f} x {ext[3] - ext[1]:.1f} mm, diện tích {area:.0f} mm², ~{mass:.1f} g')
min_prop_gap = min(Point(x, y).distance(Point(x2, y2)) - PROP_D for (x, y) in MOTORS.values() for (x2, y2) in MOTORS.values() if (x, y) != (x2, y2))
print(f'khe hở giữa 2 cánh kề nhau: {min_prop_gap:.1f} mm')
devkit = box(-14, -14.2, 37, 14.2)
print('prop che DevKit (nhìn từ trên):', ', '.join(f'{n}: {Point(x, y).buffer(PROP_D / 2).intersection(devkit).area:.0f} mm²' for n, (x, y) in MOTORS.items()))
thin = frame.buffer(-0.6)   # thành mỏng hơn 1,2 mm sẽ bị tách rời khi co lại
print('thành mỏng < 1.2 mm:', 'KHÔNG' if thin.geom_type == 'Polygon' else f'CÓ ({thin.geom_type}, {len(thin.geoms)} mảnh)')
narrow = frame.difference(frame.buffer(-1.25).buffer(1.25 + 0.05))   # phần hẹp hơn 2,5 mm (trừ góc bo)
print(f'phần gân hẹp < 2,5 mm: {narrow.area:.1f} mm²')

# ---- xuất JSON cho mô phỏng 3D (src/asm3d.js) ----
import json  # noqa: E402


def poly_json(p, tol=0.05):
    p = p.simplify(tol)
    r = lambda ring: [[round(x, 2), round(y, 2)] for x, y in list(ring.coords)[:-1]]
    return {'outer': r(p.exterior), 'holes': [r(i) for i in p.interiors]}


json.dump({'frame': poly_json(frame), 'rings': [poly_json(r) for r in rings],
           'motors': {k: [round(x, 2), round(y, 2)] for k, (x, y) in MOTORS.items()},
           'body': list(BODY), 'nose': list(NOSE), 'thickness': T, 'motorHole': MOTOR_HOLE, 'podOD': POD_OD},
          open(os.path.join(HERE, 'frame-120.json'), 'w'), separators=(',', ':'))
print('JSON:', os.path.join(HERE, 'frame-120.json'))
