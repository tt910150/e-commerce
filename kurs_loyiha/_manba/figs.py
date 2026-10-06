"""Kurs loyihalari uchun sxema va chizmalar (matplotlib)."""
import sys
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon, Ellipse

OUT = sys.argv[1] if len(sys.argv) > 1 else "."
plt.rcParams["font.family"] = "DejaVu Serif"
LW = 1.4


def vessel(ax, x, y, w, h, label=None, num=None, fc="white", r=None):
    r = r if r is not None else min(w, h) * 0.25
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0,rounding_size={r}", fc=fc, ec="k", lw=LW))
    if num is not None:
        ax.text(x + w / 2, y + h / 2, str(num), ha="center", va="center", fontsize=11, weight="bold")
    if label:
        ax.text(x + w / 2, y - 0.25, label, ha="center", va="top", fontsize=7)


def hx(ax, x, y, r=0.35, num=None):
    ax.add_patch(Circle((x, y), r, fc="white", ec="k", lw=LW))
    xs = [x - r * 0.9, x - r * 0.5, x - r * 0.2, x + r * 0.2, x + r * 0.5, x + r * 0.9]
    ys = [y, y + r * 0.5, y - r * 0.5, y + r * 0.5, y - r * 0.5, y]
    ax.plot(xs, ys, "k", lw=1)
    if num is not None:
        ax.text(x, y + r + 0.12, str(num), ha="center", va="bottom", fontsize=10, weight="bold")


def comp(ax, x, y, r=0.35, num=None, pump=False):
    ax.add_patch(Circle((x, y), r, fc="white", ec="k", lw=LW))
    if pump:
        ax.add_patch(Polygon([[x - r * 0.6, y - r * 0.5], [x + r * 0.8, y], [x - r * 0.6, y + r * 0.5]], closed=True, fc="k"))
    else:
        ax.plot([x - r * 0.7, x + r * 0.7], [y + r * 0.7, y + r * 0.35], "k", lw=1)
        ax.plot([x - r * 0.7, x + r * 0.7], [y - r * 0.7, y - r * 0.35], "k", lw=1)
    if num is not None:
        ax.text(x, y - r - 0.12, str(num), ha="center", va="top", fontsize=10, weight="bold")


def line(ax, pts, color="k", arrow=True, lw=1.2, ls="-"):
    xs, ys = zip(*pts)
    ax.plot(xs, ys, color=color, lw=lw, ls=ls)
    if arrow:
        (x0, y0), (x1, y1) = pts[-2], pts[-1]
        ax.annotate("", xy=(x1, y1), xytext=(x0 + (x1 - x0) * 0.6, y0 + (y1 - y0) * 0.6),
                    arrowprops=dict(arrowstyle="-|>", color=color, lw=lw, mutation_scale=11))


def txt(ax, x, y, s, **k):
    ax.text(x, y, s, fontsize=k.pop("fs", 7.5), **k)


def catalyst(ax, x, y, w, h):
    ax.add_patch(Rectangle((x, y), w, h, fc="#d9d9d9", ec="k", lw=0.8, hatch="..."))


def scheme1():
    fig, ax = plt.subplots(figsize=(11, 6.2))
    ax.set_xlim(0, 22); ax.set_ylim(0, 12.4); ax.axis("off")
    # tabiiy gaz
    txt(ax, 0.1, 10.9, "Tabiiy gaz\n150 m³/soat", fs=8)
    comp(ax, 1.5, 10.0, num=1)
    line(ax, [(0.4, 10.6), (0.4, 10.0), (1.15, 10.0)])
    # 3 - oltingugurtdan tozalash
    vessel(ax, 3.0, 8.6, 0.9, 2.4, num="3a"); vessel(ax, 4.3, 8.6, 0.9, 2.4, num="3b")
    line(ax, [(1.85, 10.0), (2.5, 10.0), (2.5, 11.4), (3.45, 11.4), (3.45, 11.0)])
    line(ax, [(3.45, 8.6), (3.45, 8.2), (4.75, 8.2), (4.75, 8.6)])
    # 5 - quvurli pech
    ax.add_patch(Rectangle((6.6, 3.0), 3.4, 5.6, fc="white", ec="k", lw=LW))
    ax.add_patch(Rectangle((6.6, 8.6), 3.4, 2.4, fc="white", ec="k", lw=LW))
    for xi in [7.1, 7.6, 8.1, 8.6, 9.1, 9.5]:
        catalyst(ax, xi - 0.1, 3.6, 0.2, 4.6)
    for yi in [9.0, 9.5, 10.0, 10.5]:
        ax.plot([6.8, 9.8], [yi, yi], "k", lw=0.8)
    ax.text(8.3, 3.25, "5", ha="center", fontsize=11, weight="bold")
    ax.text(8.3, 10.75, "2", ha="center", fontsize=10, weight="bold")
    for xi in [7.35, 8.35, 9.3]:
        ax.add_patch(Polygon([[xi - 0.15, 8.45], [xi + 0.15, 8.45], [xi, 8.15]], fc="#f4a460", ec="k", lw=0.6))
    # gaz isitgich orqali
    line(ax, [(4.75, 11.0), (4.75, 11.7), (6.3, 11.7), (6.3, 10.75), (6.8, 10.75)])
    # 4 - aralashtirgich
    vessel(ax, 5.5, 6.6, 0.6, 0.9, num=4, r=0.1)
    line(ax, [(6.8, 9.0), (5.8, 9.0), (5.8, 7.5)])
    txt(ax, 3.3, 6.45, "Texnologik bug‘\n(S/C = 3,7)")
    line(ax, [(4.7, 7.05), (5.5, 7.05)])
    line(ax, [(5.8, 6.6), (5.8, 6.2), (6.3, 6.2), (6.3, 8.45), (7.0, 8.45)], arrow=False)
    line(ax, [(7.0, 8.45), (7.1, 8.2)])
    # pech chiqishi kollektor
    ax.plot([7.1, 9.5], [3.5, 3.5], "k", lw=2)
    # 6 - havo kompressori
    comp(ax, 11.0, 1.2, num=6)
    txt(ax, 9.5, 0.4, "Havo")
    line(ax, [(9.9, 0.7), (10.3, 0.7), (10.3, 1.2), (10.65, 1.2)])
    line(ax, [(11.35, 1.2), (12.3, 1.2), (12.3, 9.1), (11.75, 9.1), (11.75, 8.6)])
    # 7 - ikkilamchi konvertor
    vessel(ax, 11.2, 3.0, 1.1, 5.6, num="")
    catalyst(ax, 11.3, 3.6, 0.9, 2.6)
    ax.text(11.75, 7.2, "7", ha="center", fontsize=11, weight="bold")
    line(ax, [(9.5, 3.5), (10.6, 3.5), (10.6, 8.0), (11.2, 8.0)])
    # 8 - qozon utilizator
    ax.add_patch(Rectangle((13.0, 2.6), 2.2, 0.9, fc="white", ec="k", lw=LW))
    for xi in [13.3, 13.7, 14.1, 14.5, 14.9]:
        ax.plot([xi, xi], [2.7, 3.4], "k", lw=0.7)
    ax.text(14.1, 2.25, "8", ha="center", fontsize=11, weight="bold")
    line(ax, [(11.75, 3.0), (11.75, 2.2), (12.6, 2.2), (12.6, 3.05), (13.0, 3.05)])
    vessel(ax, 13.4, 4.0, 1.4, 0.7, r=0.3)
    ax.text(14.1, 4.35, "B", ha="center", va="center", fontsize=8)
    line(ax, [(14.1, 3.5), (14.1, 4.0)], arrow=False)
    line(ax, [(14.1, 4.7), (14.1, 5.3)]); txt(ax, 13.4, 5.4, "Bug‘ 4 MPa")
    # 9 - YuH CO konvertori
    vessel(ax, 16.0, 6.0, 1.2, 3.6)
    catalyst(ax, 16.1, 6.7, 1.0, 2.0)
    ax.text(16.6, 9.0, "9", ha="center", fontsize=11, weight="bold")
    line(ax, [(15.2, 3.05), (15.6, 3.05), (15.6, 10.1), (16.6, 10.1), (16.6, 9.6)])
    # 10 - issiqlik almashtirgich
    hx(ax, 16.6, 4.9, num=None); ax.text(17.1, 4.9, "10", fontsize=10, weight="bold", va="center")
    line(ax, [(16.6, 6.0), (16.6, 5.25)])
    # 11 - PH CO konvertori
    vessel(ax, 18.3, 6.0, 1.2, 3.6)
    catalyst(ax, 18.4, 6.7, 1.0, 2.0)
    ax.text(18.9, 9.0, "11", ha="center", fontsize=11, weight="bold")
    line(ax, [(16.6, 4.55), (16.6, 4.0), (17.9, 4.0), (17.9, 10.1), (18.9, 10.1), (18.9, 9.6)])
    # 12 - isitgich / 13 sovitgich
    hx(ax, 18.9, 4.9); ax.text(19.35, 4.9, "12", fontsize=10, weight="bold", va="center")
    line(ax, [(18.9, 6.0), (18.9, 5.25)])
    hx(ax, 18.9, 3.1); ax.text(19.35, 3.1, "13", fontsize=10, weight="bold", va="center")
    line(ax, [(18.9, 4.55), (18.9, 3.45)])
    # 14 separator
    vessel(ax, 20.3, 0.8, 0.9, 1.8, num=14)
    line(ax, [(18.9, 2.75), (18.9, 2.0), (20.3, 2.0)])
    line(ax, [(20.75, 2.6), (20.75, 3.6), (21.6, 3.6), (21.6, 4.3)])
    txt(ax, 20.2, 4.45, "Konvertlangan gaz\nMEA tozalashga", fs=7.5)
    line(ax, [(20.75, 0.8), (20.75, 0.3), (21.7, 0.3)]); txt(ax, 21.0, 0.45, "Kondensat", fs=6.5)
    # suv bilan sovitish
    line(ax, [(18.2, 3.1), (18.55, 3.1)], color="tab:blue"); txt(ax, 17.25, 2.75, "Sov. suv", fs=6.5, color="tab:blue")
    # tutun
    line(ax, [(8.3, 11.0), (8.3, 12.1)], color="0.4"); txt(ax, 8.45, 11.8, "Tutun gazlari", fs=7, color="0.3")
    txt(ax, 6.7, 2.35, "Yoqilg‘i gaz", fs=7); line(ax, [(6.6, 2.5), (7.35, 2.5), (7.35, 3.0)], color="0.3")
    fig.tight_layout()
    fig.savefig(f"{OUT}/sxema1.png", dpi=170)


def converter():
    fig, ax = plt.subplots(figsize=(6.2, 8.4))
    ax.set_xlim(-4, 5.4); ax.set_ylim(-1.2, 12.5); ax.axis("off"); ax.set_aspect("equal")
    W = 3.0; x0 = -W / 2
    # izolyatsiya
    ax.add_patch(FancyBboxPatch((x0 - 0.35, 0.65), W + 0.7, 9.7, boxstyle="round,pad=0,rounding_size=0.9", fc="#f3e6cc", ec="k", lw=0.8, hatch="//"))
    ax.add_patch(FancyBboxPatch((x0, 1.0), W, 9.0, boxstyle="round,pad=0,rounding_size=0.8", fc="white", ec="k", lw=2))
    # katalizator
    catalyst(ax, x0 + 0.08, 3.4, W - 0.16, 5.0)
    ax.add_patch(Rectangle((x0 + 0.08, 3.0), W - 0.16, 0.4, fc="#bbbbbb", ec="k", lw=0.8, hatch="oo"))
    ax.add_patch(Rectangle((x0 + 0.08, 8.4), W - 0.16, 0.3, fc="#bbbbbb", ec="k", lw=0.8, hatch="oo"))
    # kolosnik
    ax.plot([x0, x0 + W], [2.95, 2.95], "k", lw=3)
    for xi in [-1.2, -0.6, 0, 0.6, 1.2]:
        ax.plot([xi, xi], [2.95, 2.3], "k", lw=1.5)
    # taqsimlagich
    ax.plot([-0.9, 0.9], [9.3, 9.3], "k", lw=2)
    ax.add_patch(Rectangle((-0.3, 9.3), 0.6, 0.3, fc="white", ec="k"))
    # shtutserlar
    ax.add_patch(Rectangle((-0.3, 10.0), 0.6, 1.0, fc="white", ec="k", lw=1.5))
    ax.add_patch(Rectangle((-0.3, 0.0), 0.6, 1.0, fc="white", ec="k", lw=1.5))
    ax.annotate("", xy=(0, 10.2), xytext=(0, 11.9), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.annotate("", xy=(0, -1.0), xytext=(0, 0.3), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    # lyuklar va termopara
    ax.add_patch(Rectangle((x0 - 0.9, 5.6), 0.9, 0.7, fc="white", ec="k", lw=1.2))
    ax.add_patch(Rectangle((x0 + W, 2.1), 0.9, 0.6, fc="white", ec="k", lw=1.2))
    for yi in [4.0, 5.7, 7.5]:
        ax.plot([x0 + W, x0 + W + 1.0], [yi, yi], "k", lw=1.2)
        ax.plot([x0 + W + 1.0], [yi], "ko", ms=3)
    # tayanch
    ax.add_patch(Polygon([[x0 + 0.3, 1.0], [x0 - 0.2, 0.05], [x0 + 0.6, 0.05]], fc="white", ec="k"))
    ax.add_patch(Polygon([[x0 + W - 0.3, 1.0], [x0 + W + 0.2, 0.05], [x0 + W - 0.6, 0.05]], fc="white", ec="k"))
    # o'lchamlar
    ax.annotate("", xy=(x0, 12.2), xytext=(x0 + W, 12.2), arrowprops=dict(arrowstyle="<->"))
    ax.text(-0.9, 12.35, "D = 600 mm", fontsize=9)
    ax.annotate("", xy=(-2.7, 3.4), xytext=(-2.7, 8.4), arrowprops=dict(arrowstyle="<->"))
    ax.text(-3.3, 5.0, "H = 1,08 m", fontsize=9, rotation=90)
    labels = [(10.7, "1 – bug‘-gaz aralashmasi\n     kirishi (643 K)"), (9.45, "2 – gaz taqsimlagich"),
              (8.55, "3 – himoya qatlami (inert sharlar)"), (6.2, "4 – Fe–Cr katalizator qatlami"),
              (3.2, "5 – inert sharlar qatlami"), (2.6, "6 – kolosnik panjara"), (-0.6, "7 – konvertlangan gaz chiqishi")]
    for y, s in labels:
        ax.text(2.6, y, s, fontsize=7.5, va="center")
        ax.plot([1.45, 2.55], [y, y], color="0.5", lw=0.5)
    ax.text(-3.95, 5.85, "8 – lyuk", fontsize=7.5)
    ax.text(2.55, 4.6, "9 – termoparalar", fontsize=7.5)
    ax.text(-3.95, 10.25, "10 – issiqlik\nizolyatsiyasi", fontsize=7.5)
    fig.tight_layout()
    fig.savefig(f"{OUT}/konvertor.png", dpi=170)


def scheme2():
    fig, ax = plt.subplots(figsize=(11, 6.4))
    ax.set_xlim(0, 22); ax.set_ylim(0, 12.8); ax.axis("off")
    # 1 separator gaz
    vessel(ax, 0.6, 1.2, 0.9, 1.8, num=1)
    txt(ax, 0.0, 3.6, "Konvertlangan gaz\n105 m³/soat, 2,8 MPa", fs=7.5)
    line(ax, [(0.2, 3.4), (0.2, 2.6), (0.6, 2.6)])
    # 2 absorber
    vessel(ax, 2.8, 1.0, 1.4, 9.6)
    catalyst(ax, 2.9, 2.6, 1.2, 2.8); catalyst(ax, 2.9, 6.2, 1.2, 2.8)
    ax.text(3.5, 5.75, "2", ha="center", va="center", fontsize=11, weight="bold")
    line(ax, [(1.05, 3.0), (1.05, 3.4), (2.2, 3.4), (2.2, 2.0), (2.8, 2.0)])
    line(ax, [(3.5, 10.6), (3.5, 11.6), (5.4, 11.6)])
    txt(ax, 5.5, 11.45, "Tozalangan gaz (CO₂ ≤ 0,03 %)\nmetanlashga", fs=7.5)
    # 3 ekspanzer
    vessel(ax, 5.2, 0.4, 1.4, 0.8, num=3, r=0.3)
    line(ax, [(3.5, 1.0), (3.5, 0.8), (5.2, 0.8)])
    line(ax, [(5.9, 1.2), (5.9, 1.7)], color="0.4"); txt(ax, 5.3, 1.8, "Ekspanzer gazi", fs=6.5)
    # 4 nasos boy eritma
    comp(ax, 7.4, 0.8, num=4, pump=True)
    line(ax, [(6.6, 0.8), (7.05, 0.8)])
    # 6 rekuperativ IA
    hx(ax, 10.0, 4.5, r=0.5); ax.text(10.6, 4.5, "6", fontsize=10, weight="bold", va="center")
    line(ax, [(7.75, 0.8), (8.6, 0.8), (8.6, 4.5), (9.5, 4.5)])
    # 7 regenerator
    vessel(ax, 12.0, 1.8, 1.6, 8.8)
    catalyst(ax, 12.1, 3.4, 1.4, 2.4); catalyst(ax, 12.1, 6.4, 1.4, 2.6)
    ax.text(12.8, 6.1, "7", ha="center", va="center", fontsize=11, weight="bold")
    line(ax, [(10.5, 4.5), (11.2, 4.5), (11.2, 9.2), (12.0, 9.2)])
    # 8 qaynatgich
    ax.add_patch(Rectangle((14.4, 1.2), 2.0, 0.9, fc="white", ec="k", lw=LW)); ax.text(15.4, 0.75, "8", ha="center", fontsize=10, weight="bold")
    for xi in [14.7, 15.1, 15.5, 15.9]:
        ax.plot([xi, xi + 0.2], [1.3, 2.0], "k", lw=0.7)
    line(ax, [(12.8, 1.8), (12.8, 1.5), (14.4, 1.5)])
    line(ax, [(15.4, 2.1), (15.4, 2.6), (13.6, 2.6)])
    line(ax, [(17.4, 1.85), (16.4, 1.85)], color="tab:red"); txt(ax, 16.6, 2.05, "Bug‘ 0,4 MPa", fs=6.5, color="tab:red")
    # 9 kondensator, 10 flegma yig'gich
    hx(ax, 15.0, 11.2, r=0.45); ax.text(15.55, 11.2, "9", fontsize=10, weight="bold", va="center")
    line(ax, [(12.8, 10.6), (12.8, 11.2), (14.55, 11.2)])
    vessel(ax, 16.4, 9.2, 1.0, 1.4, num=10, r=0.3)
    line(ax, [(15.45, 11.2), (16.9, 11.2), (16.9, 10.6)])
    line(ax, [(17.4, 10.3), (18.6, 10.3), (18.6, 11.6)]); txt(ax, 17.8, 11.75, "CO₂ (≥98 %)\nkarbamid sexiga", fs=7.5)
    comp(ax, 16.9, 8.1, r=0.3, pump=True); ax.text(17.35, 7.95, "11", fontsize=9, weight="bold")
    line(ax, [(16.9, 9.2), (16.9, 8.4)], arrow=False)
    line(ax, [(16.6, 8.1), (14.2, 8.1), (14.2, 9.9), (13.6, 9.9)])
    txt(ax, 14.25, 8.25, "Flegma", fs=6.5)
    # regenerlangan eritma: 7 -> nasos 5 -> 6 -> 12 sovitgich -> absorber
    comp(ax, 14.2, 0.5, r=0.3, pump=True); ax.text(14.6, 0.15, "5", fontsize=9, weight="bold")
    line(ax, [(16.4, 1.65), (16.9, 1.65), (16.9, 0.5), (14.5, 0.5)])
    line(ax, [(13.9, 0.5), (10.0, 0.5), (10.0, 4.0)])
    hx(ax, 7.4, 8.2, r=0.45); ax.text(7.0, 8.75, "12", fontsize=10, weight="bold", va="center")
    line(ax, [(10.0, 5.0), (10.0, 8.2), (7.85, 8.2)])
    # 13 filtr
    vessel(ax, 5.5, 9.4, 0.7, 1.1, num=13, r=0.15)
    line(ax, [(6.95, 8.2), (5.85, 8.2), (5.85, 9.4)])
    line(ax, [(5.85, 10.5), (5.85, 10.0 + 0.6), (5.0, 10.6), (5.0, 9.6), (4.2, 9.6)])
    line(ax, [(8.0, 9.4), (7.4, 9.4), (7.4, 8.65)], color="tab:blue"); txt(ax, 7.6, 9.55, "Sov. suv", fs=6.5, color="tab:blue")
    txt(ax, 9.0, 0.05, "Regenerlangan (kambag‘al) eritma", fs=6.5)
    txt(ax, 7.9, 1.05, "Boy eritma", fs=6.5)
    fig.tight_layout()
    fig.savefig(f"{OUT}/sxema2.png", dpi=170)


def absorber():
    fig, ax = plt.subplots(figsize=(6.2, 9.0))
    ax.set_xlim(-4, 4.6); ax.set_ylim(-1.0, 14.0); ax.axis("off"); ax.set_aspect("equal")
    W = 2.0; x0 = -W / 2
    ax.add_patch(FancyBboxPatch((x0, 0.8), W, 11.6, boxstyle="round,pad=0,rounding_size=0.6", fc="white", ec="k", lw=2))
    # nasadka qatlamlari
    catalyst(ax, x0 + 0.05, 2.6, W - 0.1, 3.2); catalyst(ax, x0 + 0.05, 7.0, W - 0.1, 3.2)
    for yb in [2.55, 6.95]:
        ax.plot([x0, x0 + W], [yb, yb], "k", lw=3)
    # taqsimlagich, qayta taqsimlagich
    ax.plot([-0.7, 0.7], [10.75, 10.75], "k", lw=2)
    for xi in [-0.6, -0.2, 0.2, 0.6]:
        ax.plot([xi, xi], [10.75, 10.55], "k", lw=1)
    ax.add_patch(Polygon([[x0, 6.6], [-0.25, 6.2], [0.25, 6.2], [x0 + W, 6.6]], fc="white", ec="k"))
    # tomchi ushlagich
    ax.add_patch(Rectangle((x0 + 0.05, 11.35), W - 0.1, 0.35, fc="white", ec="k", hatch="xxx", lw=0.8))
    # suyuqlik sathi
    ax.add_patch(Rectangle((x0 + 0.05, 1.0), W - 0.1, 0.7, fc="#cfe2f3", ec="none"))
    # shtutserlar
    ax.add_patch(Rectangle((-0.2, 12.4), 0.4, 0.7, fc="white", ec="k")); ax.annotate("", xy=(0, 13.9), xytext=(0, 12.9), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.add_patch(Rectangle((-0.2, 0.1), 0.4, 0.7, fc="white", ec="k")); ax.annotate("", xy=(0, -0.8), xytext=(0, 0.3), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.add_patch(Rectangle((x0 - 0.8, 2.0), 0.8, 0.35, fc="white", ec="k")); ax.annotate("", xy=(x0 - 0.05, 2.17), xytext=(x0 - 1.6, 2.17), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.add_patch(Rectangle((x0 - 0.8, 10.9), 0.8, 0.35, fc="white", ec="k")); ax.annotate("", xy=(x0 - 0.05, 11.07), xytext=(x0 - 1.6, 11.07), arrowprops=dict(arrowstyle="-|>", lw=1.5))
    ax.add_patch(Rectangle((x0 + W, 1.25), 0.6, 0.3, fc="white", ec="k"))
    ax.annotate("", xy=(x0 - 0.0, 13.3), xytext=(x0 + W, 13.3), arrowprops=dict(arrowstyle="<->"))
    ax.text(-3.2, 13.15, "D = 200 mm", fontsize=8.5)
    ax.annotate("", xy=(2.0, 2.6), xytext=(2.0, 5.8), arrowprops=dict(arrowstyle="<->")); ax.text(2.15, 3.6, "3,0 m", fontsize=8.5, rotation=90)
    ax.annotate("", xy=(2.0, 7.0), xytext=(2.0, 10.2), arrowprops=dict(arrowstyle="<->")); ax.text(2.15, 8.0, "3,0 m", fontsize=8.5, rotation=90)
    labels = [(13.6, "1 – tozalangan gaz chiqishi"), (11.55, "2 – tomchi ushlagich"), (10.65, "3 – suyuqlik taqsimlagich"),
              (8.6, "4 – nasadka (Rashig halqalari 15×15×2)"), (6.4, "5 – qayta taqsimlagich"), (2.55, "6 – tayanch panjara"),
              (1.4, "7 – boy eritma sathi"), (-0.5, "8 – boy eritma chiqishi")]
    for y, s in labels:
        ax.text(2.7, y, s, fontsize=7.3, va="center")
    ax.text(-4.0, 11.5, "9 – kambag‘al eritma\n     kirishi", fontsize=7.3)
    ax.text(-4.0, 2.55, "10 – konvertlangan\n     gaz kirishi", fontsize=7.3)
    ax.text(1.75, 0.85, "11 – sath\n   o‘lchagich", fontsize=7.0)
    fig.tight_layout()
    fig.savefig(f"{OUT}/absorber.png", dpi=170)


scheme1(); converter(); scheme2(); absorber()


def lines_chart():
    import json, os
    p = f"{OUT}/lines.json"
    if not os.path.exists(p):
        return
    d = json.load(open(p))
    a = [r[0] for r in d]; Y = [r[1] for r in d]; Ys = [r[2] for r in d]
    fig, ax = plt.subplots(figsize=(6.4, 4.2))
    ax.semilogy(a, Y, "k-", lw=1.8, label="Ishchi chiziq Y(α)")
    ax.semilogy(a, Ys, "k--", lw=1.5, label="Muvozanat chizig‘i Y*(α, T)")
    ax.set_xlabel("Eritmaning to‘yinish darajasi α, mol CO₂/mol MEA")
    ax.set_ylabel("Y, kmol CO₂/kmol inert gaz")
    ax.grid(True, which="both", lw=0.3, color="0.8")
    ax.annotate("absorber tepasi", xy=(a[0], Y[0]), xytext=(0.19, 1.2e-4), fontsize=8, arrowprops=dict(arrowstyle="->", lw=0.7))
    ax.annotate("absorber pasti", xy=(a[-1], Y[-1]), xytext=(0.33, 0.35), fontsize=8, arrowprops=dict(arrowstyle="->", lw=0.7))
    ax.legend(fontsize=8, loc="lower right")
    ax.set_xlim(0.14, 0.46)
    fig.tight_layout()
    fig.savefig(f"{OUT}/chiziqlar.png", dpi=170)


lines_chart()
